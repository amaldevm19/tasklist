
import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating';
import {Tasks} from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './task.js'

import './body.html';


Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
})

Template.body.helpers({
   tasks(){
       const instance = Template.instance();
       if(instance.state.get('hideCompleted')){
           return Tasks.find({checked:{$ne:true}},{sort:{createdAt:-1}});
       }
       //console.log( Tasks.find({ }).fetch())
       return Tasks.find({ },{sort:{createdAt:-1}});
   },
   inCompleteCount(){
        return Tasks.find({checked:{$ne:true}}).count();
   }
});

Template.body.events({
    'submit .new-task'(event){
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;
        if(!text){return};
        Meteor.call('tasks.insert', text);
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance){
        instance.state.set('hideCompleted', event.target.checked)
    }
});