import React from 'react'
import { isUndefined, isEmpty } from 'lodash';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Card, Button, CardImg, CardTitle, CardText, CardDeck,
 CardSubtitle, CardBlock, Col, Row } from 'reactstrap';
 import {FB} from 'fb';
 
import './toggle.css';
import 'react-notifications/lib/notifications.css';

import ConnectionsModal from './ConnectionsModal.js';



export default class Protected extends React.Component {
    constructor(props){
  		super(props);
  		this.state = {
  			friendsInfo: [],
  			currentList: [],
  			showConnectionsModal: false,
  			currentElement : {},
  			type: '',
  			categories: [],
  			user_name: ''
  		}
	  }
    
    createNotification(type) {
    switch (type) {
      case 'success':
        NotificationManager.success('Information successfully saved', 'Congratulation');
        break;
      case 'error':
        NotificationManager.error('Please add information to save', 'Warning', 5000, () => {
          alert('Error');
        });
        break;
			default :
		   	return undefined
      }
    }
    
    handleSearch(e){
     	let {friendsInfo} = this.state;
     	if(e.target.value === ''){
     		this.setState({
     			currentList: friendsInfo
     		})
     	}
     	else {
    	 	let newList = friendsInfo.filter( el => (el.name.toLowerCase()).includes(e.target.value.toLowerCase()));
    	 	this.setState({
    	 		currentList: newList
    	 	})
     	}
    }
    
    showConnectionModal(el, type){
     	this.setState({
     		showConnectionsModal: true,
     		currentElement: el,
     		type
     	})
    }
    
    closeModal(){
  	 	this.setState({
  	 		showConnectionsModal: false
  	 	})
   	}
   	
   	updateSelectedCategories(categories){
   		this.setState({
   			categories
   		})
   	}

    componentDidMount() {
        let access_token = localStorage.getItem('access_token');
        let user_name = localStorage.getItem('name');
        FB.setAccessToken(access_token);
        
        FB.api('', 'post', {
            batch: [
                { method: 'get', relative_url: 'me/taggable_friends?fields=name,picture.height(200)&limit=5000' },
            ]
        }, (res) => {
            let response = JSON.parse(res[0].body);
            let friendsInfo = response.data.map((infoObj, key) => {
                    return {
                        name: infoObj.name,
                        profilePic: infoObj.picture.data.url
                    }
                });
            this.setState({
              friendsInfo,
              currentList: friendsInfo,
              user_name
            })
        });
    }

    render() {
      const { currentList, showConnectionsModal, currentElement, type, categories } = this.state;
      return (
      <div className="main">
        <div className="row">
					<div className="col-md-12">
							<input placeholder="Search Friends" onChange={(e)=>this.handleSearch(e)} />
					</div>
				</div>
				{
					isEmpty(currentList) ?
					<h4>No Records Found !</h4> : undefined
				}
				<br/>
        <div className="row">
					{
						!isUndefined(currentList) ? currentList.map( (el, id) => {
							return (
					      <div className="col-md-3" key={id}>
					        <Card block>
					        	<CardImg top width="200" height="200" src={el.profilePic} alt="Card image cap" />
					          <CardTitle>{el.name}</CardTitle>
					          <div className="row"> 
					          	<div className="col-md-4">
					          		<h5>Connections</h5>
					          	</div>
					          	<div className="pull-right col-md-8	">
					          		<Button onClick={()=>this.showConnectionModal(el, 'Add')}>
							          	<span className="glyphicon glyphicon-plus"></span>
						          	</Button>
							          <Button onClick={()=>this.showConnectionModal(el, 'Edit')}>
							          	<span className="glyphicon glyphicon-pencil"></span>
				          			</Button>
					          	</div>
					          </div>
					        </Card>
					        <br/>
					      </div>
							);
						}) : undefined
					}
			  </div>
			  {
					showConnectionsModal ? 
					<ConnectionsModal user_name={this.state.user_name} showModal={showConnectionsModal} closeModal={()=>this.closeModal()}
						currentElement={currentElement} type={type}
						selectedCategories={(categories)=>this.updateSelectedCategories(categories)}
						categories={categories} /> : undefined
				}
				<NotificationContainer/>
      </div>
      )
    }
}