import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider} from "antd";
import PageLayout from "./components/layouts/PageLayout.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/configStore.ts";
import {useEffect} from "react";
import {fetchConfig} from "./actions/configAction.ts";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  const {locale} = useSelector((state: RootState) => state.locale);
  return (
    <ConfigProvider locale={locale}>
      <HashRouter>
        <Routes>
          <Route path="/*" element={<PageLayout/>}/>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
