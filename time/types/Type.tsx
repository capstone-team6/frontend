

type ImageType={
  firstImage: unknown;
  uri: string;
  type: string;
  name: string;
};
interface BoardData {
  boardId: number;
  scrapStus: string;
  userId: number;
  nickname: string;
  mannerTime: number;
  title: string;
  content: string;
  createdDate: string;
  itemTime: string;
  itemPrice: string;
  chatCount: number;
  scrapCount: number;
  address: string;
  longitude: number;
  latitude: number;
  boardState: string;
  category: string;
  boardType: string;
  images: ImageType[];
  who:string;
  }

  interface LocationSet{
    addressChange:string,
    markerLocation:{
      latitude:number,
      longitude:number
    }
    
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
  틈새시장:LocationSet,
  MapSearchSet:undefined;
  Posting:undefined
  ChargePay:undefined
  MinusPay:undefined
  LoginStackNavigation:undefined
  LocationSearch:undefined
  AccountEnter: undefined;
  ChatScreeen: undefined;
  chatScreenNavigator: {roomId: number; userName: string};
  postNavigatoer:undefined
  PostDetailSet:{boardId:number};
  PostingChange:{boardData:BoardData}
};
