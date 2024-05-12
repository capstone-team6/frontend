interface MainParams {
  dataFromParent:
    | {
        latitude: number;
        longitude: number;
        address: string;
      }
    | any;
  // dataToMain?: {
  //   latitude: number;
  //   longitude: number;
  //   address: string;
  // };
}

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Mypage: undefined;
  MyBuyTime: undefined;
  Notify: undefined;
  MySellTime: undefined;
  Pay: undefined;
  Appeal: undefined;
  AppealWrite: undefined;
  StackNavigator: undefined;
  SignUp: undefined;
  ChatScreen: {roomId: number; userName: string};
  Chatting: undefined;
  SignIn: undefined;
  BottmTabNavigation: undefined;
  Setting: undefined;
  Logout: undefined;
  DeleteMem: undefined;
  NameChange: undefined;
  StackNavigators: undefined;
  App: undefined;
  Main: undefined;
  PostDetail: {boardId: number};
  틈새시장: MainParams;
  MapSearchSet: undefined;
  Posting: undefined;
  ChargePay: undefined;
  MinusPay: undefined;
  LoginStackNavigation: undefined;
  LocationSearch: undefined;
  AccountEnter: undefined;
  ChatScreeen: undefined;
  chatScreenNavigator: {roomId: number; userName: string};
};
