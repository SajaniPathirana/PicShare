import React, {useState, useEffect} from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import {Link, useParams} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {client, urlFor} from '../client';
import MasonryLayout from './MasonryLayout';
import {pinDetailMorePinQuery, pinDetailQuery} from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({user}) => {

const [pins, setPins] = useState(null);
const [pinDetails, setPinDetails] = useState(null);
const [comment, setComment] = useState('');
const [addingComment, setAddingComment] = useState(false);
const {pinId} = useParams();

const fetchPinDetails = () => {
  let query = pinDetailQuery(pinId);
  if(query){
    client.fetch(query)
      .then((data) => {
        setPinDetails(data[0]);
        if(data[0]){
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => setPins(res));
        }
    })
  }
}

useEffect(() => {
  fetchPinDetails();
}, [pinId])

const addComment = () => {
  if(comment){
    setAddingComment(true);
    client
      .patch(pinId)
      .setIfMissing({comments: []})
      .insert('after', 'comments[-1]', [{
        comment,
        _kry: uuidv4(),
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        }
      }])
      .commit()
      .then(() => {
        fetchPinDetails();
        setComment('');
        setAddingComment(false);
      })
  }
}

if(!pinDetails) return <Spinner message='Loading pin details...' />;

  return (
    <>
    <div className='flex xl:flex-row flex-col m-auto bg-white' style={{maxWidth: '1500px', borderRadius: '32px'}}>
      <div className='flex justify-center items-center md:items-start flex-initial'>
        <img 
          src={pinDetails?.image && urlFor(pinDetails.image).url()}
          className='rounded-t-3xl rounded-b-lg'
          alt='user-post'
        />
      </div>
      <div className='w-full p-5 flex-1 xl:min-w-620'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2 items-center border-gray'>
            <a 
              href={`${pinDetails.image?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
            >
              <MdDownloadForOffline/>
            </a>
            <h6>Download</h6>          
          </div>
          <a href={pinDetails.destination} target='blank' rel='noreferer'>{pinDetails.destination.length > 30 ? `${pinDetails.destination.slice(0,30)}...` : pinDetails.destination}</a>
        </div>
        <div>
          <h1 className='text-3xl font-bold break-words mt-3'>
            {pinDetails.title}
          </h1>
          <p className='mt-3'>{pinDetails.about}</p>
        </div>
        <Link to={`user-profile/${pinDetails.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
          <img 
            className='w-8 h-8 rounded-full object-cover'
            src={pinDetails.postedBy?.image}
            alt='user-profile'
          />
          <p className='font-semibold capitalize'>{pinDetails.postedBy?.userName}</p>
        </Link>     
        <h2 className='mt-5 text-lg'>Comments</h2>
        <div className='max-h-370 overflow-y-auto'>
          {pinDetails?.comments?.map((comment, i) => {
            <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
              <img
                src={comment.postedBy.image}
                alt='user-profile'
                className='w-10 h-10 rounded-full cursor-pointer'
              />
              <div className='flex flex-col'>
                <p className='font-bold{'>{comment.postedBy.userName}</p>
                <p>{comment.comment}</p>
              </div>
            </div>
          })}
        </div>
        <div className='flex flex-wrap mt-6 gap-3'>
          <Link to={`user-profile/${pinDetails.postedBy?._id}`}>
            <img 
              className='w-10 h-10 rounded-full cursor-pointer'
              src={pinDetails.postedBy?.image}
              alt='user-profile'
            />
          </Link> 
          <input 
            type='text'
            placeholder='Add a comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
          />
          <button
            type='button'
            onClick={addingComment}
            className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
          >
            {addingComment ? 'Posting the comment...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
    {pins?.length > 0 ? (
      <>
        <h2 className='text-center font-bold text-2x mt-8 mb-4'>More Realated Pins</h2>
        <MasonryLayout pins={pins}/>
      </>
    ) : (
      <h2 className='text-center pt-10'>No related pins available!</h2>
    )}
    </>
  )
}

export default PinDetail