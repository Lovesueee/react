import './polyfills';
import loadReact from './react-loader';

loadReact()
  .then(() => import('./components/App'))
  .then(App => {
    const {React, ReactDOM} = window;

    // sync
    // ReactDOM.render(
    //   React.createElement(App.default),
    //   document.getElementById('root')
    // );

    // async
    ReactDOM.unstable_createRoot(document.getElementById('root'))
      .render(React.createElement(App.default))
      .then(() => {
        // react work
        // 渲染完成之后的回调
        console.log('completed!');
      });
  });
