import React, { Component } from 'react';
import './App.css';
import { Menu, Input, Form } from 'semantic-ui-react';
import Gallery from './Gallery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {activeItem: 'pictures', user: undefined, pictures: [], url: ""};
  }

  handleItemClick = (e, { name }) => {
    switch(name) {
      case 'my pictures':
        this.getMyPictures();
        break;
      case 'pictures':
        this.getPictures();
        break;
    }
    this.setState({ activeItem: name });
  }

  componentWillMount() {
    this.getUser();
    this.getPictures();
  }
  
  isLoggedIn = () => {
    return (this.state.user && this.state.user.twitter);
  }

  getPictures = (my) => {
    fetch('/api/pictures')
    .then((res) => {
      if (!res.redirected) {
        return res.json(); 
      }
    }).then((data) => {
      this.setState({pictures: data.pictures});
    });
  }

  getMyPictures = () => {
    fetch('/api/pictures/my', {credentials: 'include'})
    .then((res) => {
      if (!res.redirected) {
        return res.json(); 
      }
    }).then((data) => {
      this.setState({pictures: data.pictures});
    })
  }

  getUserPictures = (id) => {
    fetch('/api/pictures/' + id, {credentials: 'include'})
    .then((res) => {
      if (!res.redirected) {
        return res.json(); 
      }
    }).then((data) => {
      this.setState({pictures: data.pictures, activeItem: 'pictures'});
    })
  }
  
  getUser = () => {
    fetch('/user', {credentials: 'include'})
      .then((res) => {
        if (!res.redirected) {
          return res.json(); 
        }
      }).then((data) => {
        console.log(data);
        this.setState({user: data});
      })
  }

  deletePicture = (id) => {
    fetch('/api/pictures/' + id, {
      method: 'delete',
      credentials: 'include'
    })
    .then((res) => {
      this.getMyPictures();
    })
  }

  handleSubmit = (event) => {
    fetch('/api/pictures', {
      headers: { 'content-type': 'application/json' },
      method: "post",
      body: JSON.stringify({picture: {url: this.state.url}}),
      credentials: 'include'
    })
    .then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      this.getMyPictures();
      this.setState({activeItem: 'my pictures', url: ""});
      return json;
    })
    .then(
      response => response,
      error => error
    );
  }

  handleChange = (event) => {
    this.setState({url: event.target.value});
  }

  changeToDefault = (ind) => {
    var temp = this.state.pictures.slice();
    temp[ind].url = "https://react.semantic-ui.com/assets/images/wireframe/image.png";
    this.setState({pictures: temp});
  }

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item name='pictures' active={activeItem === 'pictures'} onClick={this.handleItemClick} />
          {this.isLoggedIn() ?
            <Menu.Item name='my pictures' active={activeItem === 'my pictures'} onClick={this.handleItemClick} /> :
            ""                        
          }
          {this.isLoggedIn() ?
            <Form onSubmit={this.handleSubmit}>
              <Input placeholder='New picture url' value={this.state.url} onChange={this.handleChange}/>
            </Form> :
            ""                        
          }
          <Menu.Menu position='right'>
            {this.isLoggedIn() ? 
              <Menu.Item name='logout' active={activeItem === 'logout'} onClick={() => window.location.replace('/logout')} /> :                
              <Menu.Item name='login' active={activeItem === 'login'} onClick={() => window.location.replace('/auth/twitter')} />                   
            }
          </Menu.Menu>
        </Menu>
        <Gallery pictures={this.state.pictures} active={this.state.activeItem} delete={this.deletePicture} getPictures={this.getUserPictures} toDefault={this.changeToDefault}/>
      </div>
    );
  }
}

export default App;
