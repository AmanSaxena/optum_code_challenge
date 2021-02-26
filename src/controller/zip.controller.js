const fs = require("fs");
const zipModel = require("./../model/zip.model");
const geolib = require("geolib");

exports.createZip = async function(req, res, next) {
  try {
    let zipData = await req.body;
    if (isObjectKeysMapped(zipData)) {
      fs.readFile("./data.json", function(err, data) {
        // Check for errors
        if (err) throw err;
        // Converting to JSON
        const fileData = JSON.parse(data);
        fileData.push(zipData);
        fs.writeFile("./data.json", JSON.stringify(fileData), err => {
          // Checking for errors
          if (err) throw err;
          res.status(201).json({ data: zipData });
        });
      });
    } else {
      res.status(400).json("All properties are required");
    }
  } catch (e) {
    res.status(400).json(e.message);
  }

  function isObjectKeysMapped(zipData) {
    const mappedKeysList = [];
    Object.keys(zipModel).forEach(zipModelKey => {
      mappedKeysList.push(Object.keys(zipData).includes(zipModelKey));
    });
    return !mappedKeysList.includes(false);
  }
};

exports.getZip = async function(req, res, next) {
  try {
    fs.readFile("./data.json", function(err, response) {
      // Check for errors
      if (err) throw err;
      // Converting to JSON
      let data = JSON.parse(response);

      // Getting geo data list
      const geoData = data.map(({ latitude, longitude }) => ({
        latitude,
        longitude
      }));

      const geoBounds = geolib.getBounds(geoData);
      const refLat = geoBounds.minLat;
      const refLng = geoBounds.minLng;

      if (Object.keys(req.query).length === 0) {
        res.status(200).json({ data: data });
      } else {
        let searchData = req.query;
        if (searchData["latitude"]) {
          refLat = searchData["latitude"];
        }

        if(searchData["longitude"]) {
          refLng = searchData["longitude"];
        }

        const orderedGeoData = geolib.orderByDistance(
          { latitude: refLat, longitude: refLng },
          geoData
        );

        data  = getOrderedDataByGeo(data, orderedGeoData);

        const newData = data.filter(x => {
          const validValuesArr = [];
          Object.keys(searchData).forEach(key => {
            if(x[key] && key !== "latitude" && key !== "longitude") {
              validValuesArr.push(
                x[key]
                  .toString()
                  .toLowerCase()
                  .includes(searchData[key].toString().toLowerCase())
              );
            }
          });
          return !validValuesArr.includes(false);
        });

        res.status(200).json({ data: newData });
      }
    });
  } catch (e) {
    res.status(400).json(e);
  }

  function getOrderedDataByGeo(data, orderedGeoData) {
    const sortedData = [];
    orderedGeoData.forEach(geo => {
      sortedData.push(data.find(x => x.latitude == geo.latitude && x.longitude == geo.longitude));
    });
    return sortedData;
  }

};
