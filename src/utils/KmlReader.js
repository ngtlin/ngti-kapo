export default {
  parseKml: kmlfile => {
    // const fileReader = new FileReader();
    // fileReader.onloadend = async e => {
    //   console.log('-XXX->File Loaded, e=', e);
    //   const result = await this.extractGoogleCoords(e.target.result);

    //   //Do something with result object here
    //   console.log(result);
    // }

    // fileReader.readAsText(kmlfile);
    fetch(kmlfile)
      .then(response => response.text())
      .then(text => {
        //console.log('-XXX->', text);
        const xmlDoc = (new window.DOMParser()).parseFromString(text, "text/xml");
        console.log('-XXX->extractGoogleCoords, xmlDoc=', xmlDoc);
        if (xmlDoc.documentElement.nodeName === "kml") {
        } else {
          throw Error("error while parsing");
        }
      })
      .catch(error => {
        console.log(error);
      });
  },

  parseKmlText: kmlText => {
    const xmlDoc = (new window.DOMParser()).parseFromString(kmlText, "text/xml");
    console.log('-XXX->extractGoogleCoords, xmlDoc=', xmlDoc);

  }
};