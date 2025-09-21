import React from 'react';
import TriggerList from '@/pages/Schedule/components/TriggerList';
import {Entity} from '@/types/data-modeling';

interface TriggerWrapperProps {
  datasource: string;
  model: Entity;
}

const TriggerWrapper: React.FC<TriggerWrapperProps> = ({ datasource, model }) => {
  return (
    <TriggerList
      datasource={datasource}
      model={model}
      eventOnly={true}
    />
  );
};

export default TriggerWrapper;
