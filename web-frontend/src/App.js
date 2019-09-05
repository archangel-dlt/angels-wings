import React, { Component } from 'react';
import logo from './fingerprint.svg';
import './bootstrap/css/bootstrap.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './App.css';

import { ArchangelDriver, ArchangelProviderPicker } from './lib';
import Search from './components/Search';
import CreatePhoto from './components/CreatePhoto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Logo() {
  return (
    <div>
      <img src={logo} className='App-logo float-left' alt='logo' />
      <h1 className='App-title'>Archangel - Angel's Wings</h1>
    </div>
  );
} // Logo

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driver: null,
      account: null,
      tabIndex: 0
    };
  } // constructor

  get driver() { return this.state.driver; }
  get account() { return this.driver && this.state.driver.account(); }

  setDriver(driver) {
    if (driver == null)
      return;

    this.setState({ driver: driver });
    this.watchAccount();
  } // setDriver

  watchAccount() {
    const account = this.account;

    if (this.state.account !== account) {
      this.setState({ account: account });
      this.state.driver.hasWritePermission()
        .then(perm => this.setState({ canWrite: perm }))
        .catch(() => this.setState( { canWrite: false }));
    }

    setTimeout(() => this.watchAccount(), 2000);
  } // watchAccount

  render() {
    const driver = this.state.driver;

    return (
      <Tabs
          selectedIndex={this.state.tabIndex}
          onSelect={tabIndex => this.setState({ tabIndex, sip: null })}
      >
        <TabList>
          <Tab>Search</Tab>
          { this.state.canWrite &&
            <Tab className='react-tabs__tab offset-9'>New Image Fingerprint</Tab>
          }
          </TabList>
        <TabPanel>
          <Search
            driver={driver}
            canWrite={this.state.canWrite}/>
        </TabPanel>
        { this.state.canWrite &&
          <TabPanel><CreatePhoto driver={driver}/></TabPanel>
        }
      </Tabs>
    )
  } // render
} // Body

class App extends Component {
  constructor () {
    super();
    this.state = { };
    ArchangelDriver().then(driver => this.setState({ ethereumDriver: driver }));
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header row'>
          <div className='col-md-8'>
            <Logo/>
          </div>
          <div className='col-md-4'>
            { this.renderPicker() }
          </div>
        </header>
        <div className='App-body container-fluid'>
          <div className='flex-row'>
            <div className='col-md-12'>
              <Body
                ref={ body => {
                  this.body = body;
                  body && body.setDriver(this.state.ethereumDriver);
                } }
              />
              <ToastContainer
                position={ toast.POSITION.BOTTOM_RIGHT }
                autoClose={ 5000 }
                newestOnTop
                closeOnClick
                pauseOnHove
                hideProgressBar
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPicker() {
    if (!this.state.ethereumDriver)
      return;
    return (<ArchangelProviderPicker driver={this.state.ethereumDriver}/>);
  }
}

export default App;
