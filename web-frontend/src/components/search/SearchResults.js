import React, { Component, Fragment } from 'react';
import Collapsible from 'react-collapsible';
import PhotoPackage from '../ui/PhotoPackage';

function SearchResult({ record }) {
  const noOfFiles = record.files ? record.files.length : 0

  return (
    <Fragment>
      <PhotoPackage initialData={record.data}/>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-6 offset-2'>Contains {noOfFiles} file{noOfFiles > 1 ? 's' : '' }.</div>
          <div className="col-4">Uploaded by <strong>{record.uploader}</strong> at {record.timestamp} </div>
        </div>
      </div>
      <hr/>
    </Fragment>
  );
} // SearchResult

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null
    }
  } // constructor

  clear() {
    this.setSearchResults(null, null);
    this.setErrors(null);
  } // clear

  setSearchResults(searchTerm, results, searchFn) {
    this.setState({
      searchTerm: searchTerm,
      searchResults: results,
      searchFn: searchFn
    });
  } // setSearchResults

  setErrors(errors) {
    this.setState({
      errors: errors
    });
  } // setErrors

  render() {
    const {searchTerm, searchResults, errors} = this.state;

    if (!searchResults && !errors)
      return (<div/>)

    if (errors)
      return this.renderErrors(errors);

    return this.renderResults(searchTerm, searchResults);
  } // render

  renderErrors(errors) {
    return (
      <div>
        <div className='row'>
          <div className='col-md-12'><strong>Search failed</strong></div>
        </div>
        <div className='row'>
          <div className='col-md-12'>{ errors.message || errors.error }</div>
          <div className='col-md-12'>{ JSON.stringify(errors) }</div>
        </div>
      </div>
    )
  } // renderErrors

  renderResult(result) {
    const record = result[0];
    const prev = result.slice(1);

    return (
      <div className='SearchResult' key={record.data.key}>
        <SearchResult
          record={record}
          canWrite={this.props.canWrite}
        />
        {
          (prev.length !== 0) && <Collapsible trigger='History'><small>sr
            { prev.map( (r, i) => (<SearchResult record={r} key={i} />)) }
          </small></Collapsible>
        }
      </div>
    )
  };

  renderResults(searchTerm, searchResults) {
    searchResults = searchResults || [];
    searchResults.reverse();

    const found = searchResults.length;
    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <h3>Searched for <strong>{searchTerm}</strong></h3>
            {found ?
              `${found} package${found>1 ? 's' : ''} found` :
              'No packages found'
            }
          </div>
        </div>
        <div className='row'>
          <br className='col-md-12'/>
        </div>
        {
          searchResults.map(r => this.renderResult(r))
        }
        <div className='row'>
          <hr className='col-md-12'/>
        </div>
      </div>
    )
  } // renderResults
} // SearchResults

export default SearchResults;
