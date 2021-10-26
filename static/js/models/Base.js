class BaseModel {
  constructor (collectionName) {
    this.collectionName = collectionName;
    this.baseUrl = `/${collectionName}`;
  }

  async Select () {
    const response = await fetch(this.baseUrl);
    return response.json();
  }
  async FindById (id) {
    const response = await fetch(`${this.baseUrl}/${id}`);
    return response.json();
  }
  async Create (data) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if(!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Post request error: ${errorMessage}`);
    }

    const newCollection = await response.json();

    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, {detail: newCollection});
    document.dispatchEvent(event);
  }

  async Update (id, data) {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, data})
    });

    if(!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Update request error: ${errorMessage}`);
    }
  }

  async Delete (id) {
    const response = await fetch(this.baseUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: id})
    });

    if(!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Delete request error: ${errorMessage}`);
    }
  }
}
