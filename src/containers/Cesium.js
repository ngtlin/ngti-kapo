import React from "react";
import { Viewer } from "resium";

export default class Cesium extends React.PureComponent {

  render() {
    return (
      <Viewer full />
    );
  }

}