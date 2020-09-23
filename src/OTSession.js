import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createSession from './createSession';

export default class OTSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streams: [],
    };
  }

  getChildContext() {
    return { session: this.sessionHelper.session, streams: this.state.streams };
  }

  componentWillMount() {
    this.createSession();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.apiKey !== this.props.apiKey ||
      prevProps.sessionId !== this.props.sessionId ||
      prevProps.token !== this.props.token
    ) {
      this.createSession();
    }
  }

  componentWillUnmount() {
    this.destroySession();
  }

  createSession() {
    this.destroySession();

    this.sessionHelper = createSession({
      apiKey: this.props.apiKey,
      sessionId: this.props.sessionId,
      token: this.props.token,
      onStreamsUpdated: (streams) => { this.setState({ streams }); },
      onConnect: this.props.onConnect,
      onError: this.props.onError,
      options: this.props.options,
    });

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      this.sessionHelper.session.on(this.props.eventHandlers);
    }

    const { streams } = this.sessionHelper;
    this.setState({ streams });
  }

  destroySession() {
    if (this.sessionHelper) {
      if (
        this.props.eventHandlers &&
        typeof this.props.eventHandlers === 'object'
      ) {
        this.sessionHelper.session.off(this.props.eventHandlers);
      }
      this.sessionHelper.disconnect();
    }
  }

  render() {
    const { className, style } = this.props;
    return <div className={className} style={style}>{this.props.children}</div>;
  }
}

OTSession.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  className: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  eventHandlers: PropTypes.objectOf(PropTypes.func),
  onConnect: PropTypes.func,
  onError: PropTypes.func,
  options: PropTypes.object,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

OTSession.defaultProps = {
  className: '',
  eventHandlers: null,
  onConnect: null,
  onError: null,
  options: {},
  style: {}
};

OTSession.childContextTypes = {
  streams: PropTypes.arrayOf(PropTypes.object),
  session: PropTypes.shape({
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
  }),
};
