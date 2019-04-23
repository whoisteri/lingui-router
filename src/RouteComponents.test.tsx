import {I18nProvider} from "@lingui/react";
import {Router} from "react-router";
import createMemoryHistory from "history/createMemoryHistory";
import * as React from "react";
import {mount} from "enzyme";
import {Route} from "./RouteComponents";
import {LinguiRouter} from "./LinguiRouter";


describe('Route', () => {
  it('should not render anything for paths that are not recognized', () => {
    const history = createMemoryHistory();
    history.push('/bar');

    const app = mount(
      <I18nProvider language={'cs'}>
        <LinguiRouter catalogs={{cs: {'/foo': '/foo'}}}>
          <Router history={history}>
            <Route path={"/foo"} render={() => <span>Hello!</span>}/>
          </Router>
        </LinguiRouter>
      </I18nProvider>
    );


    expect(app.find('span').exists()).toBeFalsy();
  });

  it('should recognize paths without language prefix', () => {
    const history = createMemoryHistory();
    history.push('/foo');

    const app = mount(
      <I18nProvider language={'cs'}>
        <LinguiRouter catalogs={{cs: {'/foo': '/foo'}}}>
          <Router history={history}>
            <Route path={"/foo"} render={() => <span>Hello!</span>}/>
          </Router>
        </LinguiRouter>
      </I18nProvider>
    );

    expect(app.find('span').exists()).toBeTruthy();
  });

  it('should recognize paths with language prefix', () => {
    const history = createMemoryHistory();
    history.push('/cs/foo');

    const app = mount(
      <I18nProvider language={'cs'}>
        <LinguiRouter catalogs={{cs: {'/foo': '/foo'}}}>
          <Router history={history}>
            <Route path={"/foo"} render={() => <span>Hello!</span>}/>
          </Router>
        </LinguiRouter>
      </I18nProvider>
    );

    expect(app.find('span').exists()).toBeTruthy();
  });

  it('should see the untranslated path in match.path', () => {
    const history = createMemoryHistory();
    history.push('/cs/testovaci-cesta');

    const routeFunction = jest.fn(() => null);

    mount(
      <I18nProvider language={'cs'} >
        <LinguiRouter catalogs={{cs: {'/testing-path': '/testovaci-cesta'}}}>
          <Router history={history}>
            <Route path={"/testing-path"} render={routeFunction}/>
          </Router>
        </LinguiRouter>
      </I18nProvider>
    );

    expect(routeFunction.mock.calls[0][0]).toMatchObject({
      match: {path: '/testing-path'},
      location: {pathname: '/testing-path', original: {pathname: '/cs/testovaci-cesta'}}
    });
  });

  it('should see the untranslated path with params in location.pathname', () => {
    const history = createMemoryHistory();
    history.push('/cs/testovaci-cesta/parametr');

    const routeFunction = jest.fn(() => null);

    mount(
      <I18nProvider language={'cs'}>
        <LinguiRouter catalogs={{cs: {'/testing-path/:param': '/testovaci-cesta/:param'}}}>
          <Router history={history}>
            <Route path={"/testing-path/:param"} render={routeFunction}/>
          </Router>
        </LinguiRouter>
      </I18nProvider>
    );

    expect(routeFunction.mock.calls[0][0]).toMatchObject({
      match: {path: '/testing-path/:param'},
      location: {pathname: '/testing-path/parametr', original: {pathname: '/cs/testovaci-cesta/parametr'}}
    });
  });
});
