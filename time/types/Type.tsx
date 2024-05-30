type ImageType = {
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
  who: string;
}

interface LocationSet {
  addressChange: string;
  markerLocation: {
    latitude: number;
    longitude: number;
  };
}

export type RootStackParamList = {
  Home: undefined;
  Profile:
    | {userId?: number; boardId?: number; fromPostDetail?: boolean}
    | undefined;
  Mypage: undefined;
  MyBuyTime: undefined;
  Notify: undefined;
  MySellTime: undefined;
  Pay: undefined;
  Appeal: undefined;
  AppealWrite: {objectId?: number} | undefined;
  StackNavigator: undefined;
  SignUp: undefined;
  ChatScreen: {
    roomId?: number;
    userName?: string;
    holder?: string;
    bank?: string;
    accountNumber?: string;
    roomName?: string;
    boardId?: number;
    newMessage?: {
      message: string;
      type: string;
    };
    otherUserId?: number;
    isCancelled?: boolean;
  };
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
  // 틈새시장: MainParams;

  chatStackNavigator: undefined;

  틈새시장: LocationSet | undefined;
  MapSearchSet: undefined;
  Posting: undefined;
  ChargePay: undefined;
  MinusPay: undefined;
  LoginStackNavigation: undefined;
  LocationSearch: undefined;
  AccountEnter: {boardId?: number; roomId?: number; otherUserId?: number};
  AccountCheck: {boardId?: number; roomId?: number; otherUserId?: number};

  chatScreenNavigator: {
    screen: string;
    params: {
      boardId: number;
      userName: string;
      roomName: string;
      otherUserId: number;
    };
  };

  postNavigatoer: undefined;
  PostDetailSet: {boardId: number};
  PostingChange: {boardData: BoardData};
  Scrap: undefined;
  Search: undefined;
  SearchList: {key: string};
  KeywordSet: undefined;
  ServiceEvaluationScreen: {userId?: number; boardId?: number} | undefined;
  MannerEvaluationScreen:
    | {selectedServiceEvaluation?: string[]; userId?: number; boardId?: number}
    | undefined;

  EvaluationScreen:
    | {
        userId?: number;
        boardId?: number;
        nickname?: string;
        mannerTime?: number;
      }
    | undefined;
  Appealwrite: {objectId?: number | undefined};
  WriteHistory: {userId?: number};
  TransactionHistory: {userId?: number};
  KakaoPay: {amountValue: number};
  PayBalance: undefined;
  ReportPost: {boardId: number};
  PostSet: {boardId: number};
  Help:undefined
};
