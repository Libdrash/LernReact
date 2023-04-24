import React from 'react';
import MyInput from './UI/input/MyInput';
import MySelect from './UI/select/MySelect';

const PostFilter = ({ filter, setFilter }) => {
  const handleChange = e => setFilter({ ...filter, query: e.target.value });

  return (
    <div>
      <MyInput
        value={filter.query}
        onChange={handleChange}
        placeholder='Search'
      ></MyInput>
      <MySelect
        defaultValue='Сортировка'
        value={filter.sort}
        onChange={selectedSort => setFilter({ ...filter, sort: selectedSort })}
        options={[
          {
            value: 'title',
            name: 'По названию',
          },
          {
            value: 'body',
            name: 'По описанию',
          },
        ]}
      />
    </div>
  );
};
export default PostFilter;
