import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

export default class App extends Component {

  // 画面出力用の変数初期化
  constructor(props){
    super(props);
    this.state = {
      username:"username",
      email:"email",
      token:"token placeholde"
    };
  }

  // 画面出力用のTextと関数呼び出し用のButtonを追加
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>username:{this.state.username}</Text>
        <Text>email:{this.state.email}</Text>
        <Text>idtoken:{this.state.token}</Text>
        <Button title="login" onPress={this.login} />
        <Button title="token" onPress={this.idtoken} />
        <Button title="logout" onPress={this.logout} />
        <StatusBar style="auto" />
      </View>
    );
  }

  
  // ここからログイン等の関数
  login = () => { 
    const signin = async function () {
      await Auth.signIn("username", "password"); // 要変更
      const userinfo = await Auth.currentUserInfo();
      console.log(userinfo)
      return userinfo
    };
    signin().then((userinfo) =>
      this.setState({ 
        username: userinfo.username,
        email:userinfo.attributes.email 
      })
    );
  };

  // idtokenの取得：loginせずに呼び出すとエラー
  idtoken = () => {
    const gettoken = async function () {
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;
      console.log(token);
      return token;
    };
    gettoken().then(token=>this.setState({token:token}));
  };

  // logout
  logout = async function () {
    await Auth.signOut();
  };

}

// Cognitoに必要な設定を記述
Amplify.configure({
  Auth: {
    // この下要変更
    // Amazon Cognito User Pool ID
    userPoolId: "ap-xxxxxxxx-x_xxxxxxxxx",
    // Amazon Cognito User Pool App Client ID
    userPoolWebClientId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    // Amazon Cognito Region
    region: "ap-northeast-1", 
  },
  Analytics: {
    disabled: true,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
