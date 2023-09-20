package com.example.colorimagemobile.services.socket

import androidx.fragment.app.FragmentActivity
import com.example.colorimagemobile.classes.AbsSocket
import com.example.colorimagemobile.classes.JSONConvertor
import com.example.colorimagemobile.models.ChatSocketModel
import com.example.colorimagemobile.services.chat.ChatAdapterService
import com.example.colorimagemobile.services.chat.ChatService
import com.example.colorimagemobile.services.chat.TextChannelService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.CommonFun.Companion.printMsg
import com.example.colorimagemobile.utils.Constants
import com.example.colorimagemobile.utils.Constants.SOCKETS
import io.socket.emitter.Emitter
import org.json.JSONException
import org.json.JSONObject

object ChatSocketService: AbsSocket(SOCKETS.CHAT_NAMESPACE_NAME) {
    private var fragmentActivity: FragmentActivity? = null

    override fun disconnect() {
        mSocket.off(SOCKETS.TEXT_MESSAGE_EVENT_NAME, listenMessage)

        // leave each connected room
        TextChannelService.getConnectedChannels().forEach {
            leaveRoom(Constants.SocketRoomInformation(UserService.getUserInfo()._id, it.name))
        }

        super.disconnect()
    }

    override fun setFragmentActivity(fragmentAct: FragmentActivity) {
        fragmentActivity = fragmentAct
        setSocketListeners()
    }

    override fun setSocketListeners() {
        mSocket.on(SOCKETS.TEXT_MESSAGE_EVENT_NAME, listenMessage)
    }

    public override fun emit(event: String, data: Any) {
        super.emit(event, data)
    }

    fun sendMessage(message: JSONObject) {
        super.emit(SOCKETS.TEXT_MESSAGE_EVENT_NAME, message);
    }

    private val listenMessage =
        Emitter.Listener { args ->
            fragmentActivity!!.runOnUiThread(Runnable {
                try {
                    val currentArg = args[0].toString()
                    val message = JSONConvertor.getJSONObject(currentArg, ChatSocketModel::class.java)
                    ChatService.addMessage(message)

                    val currentRoom = TextChannelService.getCurrentChannel().name
                    if (message.roomName == currentRoom) {
                        ChatAdapterService.getChatMsgAdapter().addChatItem(message)
                    }
                } catch (e: JSONException) {
                    printMsg("listenMessage error: ${e.message}")
                    return@Runnable
                }
            })
        }
}