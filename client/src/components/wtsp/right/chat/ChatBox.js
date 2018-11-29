import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import Avatar from 'react-user-avatar'

import * as actions from 'actions/'

import event from 'plugins/bus'

import Send from 'components/wtsp/right/chat/Send'
import Messages from 'components/wtsp/right/chat/Messages'

import template from 'templates/wtsp/right/chat/chatbox.pug'

class ChatBox extends Component {
    
    state = { 
        showChat: false,
        userChat:  this.props.location.split('/').pop(),
        rooms: this.props.chats.chatsList,
        activeRoom: null,
        allMessages: []
     }

     
    componentDidMount() {

        this.getChatByUserName()

        event.$on('show_chat', () => {
            let rooms = this.props.chats.chatsList
            this.setState({ rooms })
            this.getChatByUserName()
        })
    }

    async getMessages() {
        let roomType = this.props.roomType === 'friends' ? 'friend' : 'group'
        await this.props.getMessages(`${roomType}_chat`, this.state.activeRoom.id)     
        this.setState({ allMessages: this.props.room.messagesList }) 
    }

    getChatByUserName() {

        if (Object.keys(this.state.rooms).length) {
            let room = this.props.chats.chatsList[this.props.roomType].find(room => {
                const roomName = (room.user) ? room.user.username : room.name
                return roomName === this.friendName()
            })
            let activeRoom = {
                id: room.id,
                name: room.user ?  room.user.username : room.name
            }
            this.setState({ activeRoom }, () => {
                this.getMessages()
            })
        }

    }

    friendName() {
        let userChat = this.state.userChat
        return userChat.replace('_', ' ')
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            this.changeUserChat(nextProps.location.split('/').pop())
        }
    }

    changeUserChat(userChat) {
        this.setState({ userChat }, () => this.getChatByUserName())
    }

    render() {
        return template.call(this, { Avatar, Send, Messages })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(ChatBox)

