import { Avatar, IconButton } from "@material-ui/core";
import styled from "styled-components";
import MoreIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase-init";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useState } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { useRef } from "react";

const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const endOfMessageRef = useRef(null);
  const [input, setInput] = useState("");
  const router = useRouter();
  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const recipientEmail = getRecipientEmail(chat.users, user);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );

  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "end",
    });
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" hidden disabled={!input} onClick={sendMessage}>
          Send message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
