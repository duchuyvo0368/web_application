import React from 'react';
import FriendsGrid from './grid/FriendGrid';
import UserGrid from '../../user/components/grid/UserGrid';
import RequestSentGrid from './grid/RequestSentGrid';
import FriendsRequestGrid from './grid/FriendRequestGrid';

interface FriendGridProps {
  type: 'friends' | 'suggestions' | 'request' | 'following' | 'sent';
}

const FriendGrid: React.FC<FriendGridProps> = ({ type }) => {
  let content;

  switch (type) {
    case 'friends':
      content = <FriendsGrid />;
      break;
    case 'suggestions':
      content = <UserGrid />;
      break;
    case 'request':
      content =<FriendsRequestGrid/>
      break;
    case 'following':
      content = (
        <div className="px-4 py-6">
          <p className="text-center text-gray-600">List Follow</p>
        </div>
      );
      break;
    case 'sent':
     content= <RequestSentGrid/>
      break;
    default:
      content = <FriendsGrid />;
  }

  return <div className="w-full mt-5  ">{content}</div>;
};

export default FriendGrid;
