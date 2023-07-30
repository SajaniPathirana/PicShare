import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import {client} from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner'; 
import { feedQuery, searchQuery } from '../utils/data';
import Pins from '../container/Pins';

const Feed = () => {

  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState();
  const {categoryId} = useParams();

  useEffect(() => {
    if(categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);
      client.fetch(query)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    } else{
      setLoading(true);
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    }
  }, [categoryId]);

  if(loading) return <Spinner message='Loading pins...'/>
  if(!pins?.length) return <h2 className='text-center'>No pins available!</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed
