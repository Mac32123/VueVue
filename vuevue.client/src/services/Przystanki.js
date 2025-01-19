const przystankiUrl = {
  list: `https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json`,
  odjazdyTime: (Id) => `https://ckan2.multimediagdansk.pl/delays?stopId=${Id}`
}

const przystankiService = {
  async getPrzystaneki() {
   //const data = await this._fetchBusStop();
   //return data;
    const lastUpdateString = localStorage.getItem("lastStopsUpdate")
    if (lastUpdateString !== null) {
      const lastUpdate = new Date(lastUpdateString);
      let shouldFetch = false;
      if (lastUpdate.getTime < new Date().getTime()) {
        const expiration = this._createExpirationDate();
        localStorage.setItem("lastStopsUpdate", expiration.toISOString());
        shouldFetch = true;
      }
      if (shouldFetch) {
        const data = await this._fetchBusStop();
        localStorage.setItem("stopsData", JSON.stringify(data));
        return data;
      }
      else {
        const dataString = localStorage.getItem("stopsData");
        const data = JSON.parse(dataString);
        return data;
      }
    }
    else {
      const data = await this._fetchBusStop();
      const expiration = this._createExpirationDate();
      localStorage.setItem("stopsData", JSON.stringify(data));
      localStorage.setItem("lastStopsUpdate", expiration.toISOString());
      return data;
    }
  },

  _createExpirationDate() {
    var expiration = new Date();
    expiration.setDate(expiration.getDate() + 1);
    expiration.setHours(6);
    return expiration;
  },

  async _fetchBusStop() {
    try {
      const res = await fetch(przystankiUrl.list,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'applicaton/json',
            'Accept': 'application/json'
          }
        })

      const data = await res.json();
      const values = Object.values(data)
      return values[0];
    }
    catch(error) {

    }
  },

  async getEstimatedDepartures(stopId) {
    try {
      const url = przystankiUrl.odjazdyTime(stopId);
      const res = await fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'applicaton/json',
            'Accept': 'application/json'
          }
        })

      const data = await res.json();
      return data.delay;
    }
    catch (e) {

    }
  }

}

export default przystankiService;
