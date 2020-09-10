'use strict';

// put your own value below!
const apiKey = 'TzfLrDQxu3CKagkC7ar4vhNKnf013FgeNcKVOU8I'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#results-list').empty();
  if (responseJson.total === "0") {
      $('#results-list').append(
          `<li><p>There are no results in the states you entered, or you have not entered the two letter state codes without spaces. Please try again.</p></li>`
      )
    } else {
  // iterate through the items array
        for (let i = 0; i < responseJson.data.length; i++){

            $('#results-list').append(
                `<li><h3>${responseJson.data[i].fullName}</h3>
                <p>${responseJson.data[i].description}</p>
                <p><a href="${responseJson.data[i].url}" target+"_blank">${responseJson.data[i].url}</a>
                </li>`
            )};
    }
  //display the results section  
    $('#results').removeClass('hidden');
};

function getStateParkResults(searchTerm, maxResults=10) {
  const params = {
    stateCode: searchTerm, 
    api_key: apiKey,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getStateParkResults(searchTerm, maxResults);
  });
}

$(watchForm);