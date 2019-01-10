import React, { PureComponent } from "react";
import {
  CesiumTerrainProvider,
  UrlTemplateImageryProvider,
  GeographicTilingScheme,
  Rectangle,
  SceneMode,
  Math,
  Color,
  Cartesian3,
}
from 'cesium';
import { Viewer, Camera, CameraFlyTo, Scene, Globe, Cesium3DTileset, KmlDataSource } from "resium";

import Controls from '../components/cesiumControls';

const showControls = false;

class CesiumMap extends PureComponent {

  componentWillMount() {
    console.log('-XXX->WILL MOUNT');
    this._rect = Rectangle.fromDegrees(
      5.013926957923385,
      45.35600133779394,
      11.477436312994008,
      48.27502358353741
    );
    this._terrainProvider = new CesiumTerrainProvider({
      url: "//3d.geo.admin.ch/1.0.0/ch.swisstopo.terrain.3d/default/20160115/4326/"
    });
    this._imageryProvider = new UrlTemplateImageryProvider({
      // Aerial image
      //url: "//wmts20.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/default/current/4326/{z}/{x}/{y}.jpeg",
      // Map
      url: "//wmts10.geo.admin.ch/1.0.0/ch.swisstopo.swisstlm3d-karte-farbe.3d/default/current/4326/{z}/{x}/{y}.jpeg",
      minimumLevel: 8,
      maximumLevel: 17,
      tilingScheme: new GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
      }),
      rectangle: this._rect
    });
    //this._camaraDestination = Rectangle.fromDegrees(7.87, 46.58, 7.88, 46.59); // Mürren
    this._camaraDestination = Rectangle.fromDegrees(8.54, 47.32, 8.55, 47.34); // Zürich
    this._camaraOrientation = {
      heading: Math.toRadians(0),
      pitch: Math.toRadians(-35.0),
      roll: 0.0
    };
    this._sceneSettins = {
      sceneMode: SceneMode.SCENE3D,
      backgroundColor: Color.WHITE,
      globe: {
        baseColor: Color.WHITE
      },
      tileSetUrl: "https://vectortiles0.geo.admin.ch/3d-tiles/ch.swisstopo.swisstlm3d.3d/20180716/tileset.json"
    };
    this._klmSource = "https://res.cloudinary.com/ngti/raw/upload/v1545129598/klmdata/zurich-doc.kml";

    console.log('-XXX->MOUNTING, viwer=', this._viewer);
  }

  componentDidMount() {
    console.log('-XXX->MOUNTED, viwer=', this._viewer);
    const options = {};
    options.defaultResetView = this._camaraDestination;
    // Only the compass will show on the map
    options.enableCompass = true;
    options.enableZoomControls = true;
    options.enableDistanceLegend = true;
    console.log('-XXX->MOUNTED, window=', window);
    if (window.viewerCesiumNavigationMixin) {
      this._viewer.extend(window.viewerCesiumNavigationMixin, options);
    }
  }

  getCesiumTileset = () => {
    return new Cesium3DTileset({
      url: "https://vectortiles0.geo.admin.ch/3d-tiles/ch.swisstopo.swisstlm3d.3d/20180716/tileset.json"
    });
  };

  _onCameraChange = (e) => {
    console.log('-XXX->_onCameraChange! e=', e);
  }

  _onCameraMoveStart = (e) => {
    console.log('-XXX->_onCameraMoveStart! e=', e);
  }

  _onCameraMoveEnd = (e) => {
    console.log('-XXX->_onCameraMoveEnd! e=', e);
  }

  _onTileSetReady = (tileset) => {
    console.log('-***->_onTileSetReady, tileset=', tileset);
    if (this._viewer) {
      this._viewer.zoomTo(tileset);
    }
  }

  _onAllTilesLoad = () => {
    console.log('-XXX->_onAllTilesLoad!');
  }
  _onInitialTilesLoad = () => {
    console.log('-XXX->_onInitialTilesLoad!');
  }
  _onLoadProgress = (numberOfPendingRequests, numberOfTilesProcessing) => {
    //console.log('-XXX->_onLoadProgress! nbReq=', numberOfPendingRequests, ', nbProc=', numberOfTilesProcessing);
  }
  _onTileFailed = (tile) => {
    console.log('-XXX->_onTileFailed! tile=', tile);
  }
  _onTileLoad = (tile) => {
    //console.log('-XXX->_onTileLoad! tile=', tile);
  }
  _onTileUnload = () => {
    console.log('-XXX->_onTileUnload!');
  }
  _onTileVisible = (tile) => {
    //console.log('-XXX->_onTileVisible! tile=', tile);
  }

  _onKlmLoad = () => {
    console.log('-XXX->_onKlmLoad!');
  }

  _onKlmError = () => {
    console.log('-XXX->_onKlmError!');
  }

  render() {
    //console.log('-XXX->render, terrrainOProvider=', this._terrainProvider, ', imageryProvider=', this._imageryProvider);
    //console.log('-XXX->render, tileSetUrl=', this._sceneSettins.tileSetUrl);
    return (
      <div>
        <Viewer
          ref={e => {
            if (e !== null && e.cesiumElement) {
              console.log('-XXX->Plugin navigation!')
              this._viewer = e.cesiumElement;
            } else {
              this._viewer = undefined;
            }
          }}
          baseLayerPicker={false}
          animation={false}
          terrainProvider={this._terrainProvider}
          imageryProvider={this._imageryProvider}
          sceneModePicker={false}
          selectionIndicator={false}
          timeline={true}
          homeButton={false}
          full
        >
          <Scene
            mode={this._sceneSettins.sceneMode}
            backgroundColor={this._sceneSettins.backgroundColor}
          >
            <Globe baseColor={this._sceneSettins.globe.baseColor} />
            <Camera
              onMoveEnd={this._onCameraMoveEnd}
              onMoveStart={this._onCameraMoveStart}
              onChange={this._onCameraChange}
            />
            <CameraFlyTo
              destination={this._camaraDestination}
              orientation={this._camaraOrientation}
            />
          </Scene>
          <KmlDataSource data={this._klmSource} onLoad={this._onKlmLoad} onError={this._onKlmError} />
          <Cesium3DTileset
            url={this._sceneSettins.tileSetUrl}
            onReady={this._onTileSetReady}
            onAllTilesLoad={this._onAllTilesLoad}
            onInitialTilesLoad={this._onInitialTilesLoad}
            onLoadProgress={this._onLoadProgress}
            onTileFailed={this._onTileFailed}
            onTileLoad={this._onTileLoad}
            onTileUnload={this._onTileUnload}
            onTileVisible={this._onTileVisible}
          />
        </Viewer>
        {showControls &&
          <Controls />
        }
      </div>
    );
  }
}

export default CesiumMap;