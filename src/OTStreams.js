import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import OTSubscriberContext from './OTSubscriberContext';

export default function OTStreams(props, context) {
  const session = props.session || context.session || null;
  const streams = props.streams || context.streams || null;
  const { className, style } = props;

  if (!session) {
    return <div className={className} style={style} />;
  }

  const child = Children.only(props.children);

  const childrenWithContextWrapper = Array.isArray(streams)
    ? streams.map(stream => (child
      ? <OTSubscriberContext stream={stream} key={stream.id} >
        { cloneElement(child) }
      </OTSubscriberContext>
      : child))
    : null;

  return <div className={className} style={style}>{childrenWithContextWrapper}</div>;
}

OTStreams.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  session: PropTypes.shape({ publish: PropTypes.func, subscribe: PropTypes.func }),
  streams: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

OTStreams.defaultProps = {
  className: '',
  session: null,
  streams: null,
  style: {},
};

OTStreams.contextTypes = {
  session: PropTypes.shape({ publish: PropTypes.func, subscribe: PropTypes.func }),
  streams: PropTypes.arrayOf(PropTypes.object),
};
