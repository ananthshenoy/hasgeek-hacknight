import React, { Component } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Modal, Button } from 'react-bootstrap';
import Toggle from 'react-toggle';
import axios from 'axios';
import { CardImg } from 'reactstrap';


import './toggle.css';
import 'react-notifications/lib/notifications.css';

class ConnectionsModal extends Component {

	constructor(props){
		super(props);
		this.state = {
			header: '',
			footer: '',
				categories: [
				{ label: 'Like',
					value: false 
				},
				{
					label: 'Flirt',
					value: false
				},
				{
					label: 'Date',
					value: false
				},{
					label: 'Besties',
					value: false
				},
				{
					label: 'Hangout',
					value: false
				},
				{
					label: 'BlackList',
					value: false
				}
			]
		}
		
		this.addLabels = this.addLabels.bind(this);
	}

	componentWillMount(){
		let {type, categories} = this.props;
		if(type === 'Add'){
			this.setState({
				header: 'Add Connections',
				footer: 'Add'
			})
		}
		else if(type === 'Edit'){
			this.setState({
				header: 'Edit Connections',
				footer: 'Edit',
				categories
			})
		}
	}

	createNotification(type) {
    switch (type) {
      case 'Add Success':
        NotificationManager.success('Connections Added Successfully', 'Congratulations');
        break;
      case 'Edit Success':
        NotificationManager.success('Connections Edited Successfully', 'Congratulations');
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

  notifyMe(data) {
    let msg = data.map((obj, key) => {
      return obj.name + " " + obj.value + 's you';
    });
    
    msg = msg.join("\n");
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(msg);
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(msg);
        }
      });
    }
  
    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
  }

  addLabels(categories){
  	const {closeModal, type, selectedCategories, user_name, currentElement} = this.props;
  	if(type === 'Add'){
  		this.createNotification('Add Success');
  	}
  	else if(type === 'Edit'){
  		this.createNotification('Edit Success')
  	}
  	selectedCategories(categories);
  	closeModal();
  	let selectedCategory = '';
  	for(var i=0;i<categories.length;i++)
  	  if(categories[i].value === true)
  	    selectedCategory = categories[i].label;
  	let data = {
  	  user: user_name,
  	  action: selectedCategory,
  	  friend: currentElement.name
  	}
  	axios.post('https://friendmatch-ananthshenoy.c9users.io:8081/buddy/', {
      user: user_name,
  	  action: selectedCategory,
  	  friend: currentElement.name
    })
    .then((response) => {
      console.log(response);
      this.notifyMe(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  	console.log(data);
  }

  handleCategoryChange(element){
  	let {categories} = this.state;
  	let selectedList = categories.map( (el) => {
  		if(el === element){
  			return ({
  				label: el.label,
  				value: !el.value
  			})
  		}
  		return el;
  	});
  	this.setState({
  		categories: selectedList
  	})
  }

	render() {
		const {showModal, closeModal, currentElement} = this.props;
		const {header, footer, categories} = this.state;
		return(
			<div>
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{header}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
            	<div className="col-md-6">
            		<CardImg top width="200" height="200" src={currentElement.profilePic} alt="Card image cap" />
            	</div>
            	<div className="col-md-6">
            		<h5>* Select the Categories </h5>
	            	<div className="row">
	            		{
	            			categories.map( (el) => {
	            				return(
          							<div className="col-md-6">
			            				<label>
												  	<Toggle
													    defaultChecked={el.value}
													    onChange={() => this.handleCategoryChange(el)} />
												  	<h4>{el.label}</h4>
													</label>
												</div>
	          					)
	            			})
	            		}
          			</div>
        			</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>this.addLabels(categories)}>{footer}</Button>
          </Modal.Footer>
        </Modal>
				<NotificationContainer/>
			</div>
		)
	}
}

export default ConnectionsModal;