import { extendObservable } from 'mobx';
import set from 'lodash/set';
import assign from 'lodash/assign';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

import { action } from 'mobx';
const defaultMethods = [
  '$assign',
  '$merge',
  '$set',
  '$bindActions'
];

function wrapModel(model, fields, excludedFields) {
  const obsFields = excludedFields ? omit(fields, excludedFields) : fields;
  extendObservable(model, obsFields);
  if (process.env.NODE_ENV !== 'production') {
    defaultMethods.forEach(m=> {
      if (m in model) {
        console.warn(`${m} in model will be override!`);
      }
    })
  }

  model.$set = action((fieldPath, value)=> {
    set(model, fieldPath, value)
  });
  model.$assign = action(data => {
    assign(model, data)
  });
  model.$merge = action(data=> {
    merge(model, data)
  });
  model.$bindAction = (actions)=> {
    for (let key in actions) {
      if (process.env.NODE_ENV !== 'production') {
        if (key in model) {
          console.warn(`model has filed '${key}' already. old filed will be override`)
        }
      }
      const value = actions[key];
      model[key] = value.bind(model);
    }
  }
}
export default wrapModel


