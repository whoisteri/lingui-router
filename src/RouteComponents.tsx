import {
  Route as RRRoute,
  RouteChildrenProps as RRRouteChildrenProps,
  RouteComponentProps as RRRouteComponentProps,
  RouteProps as RRRouteProps,
  SwitchProps
} from "react-router";
import * as React from "react";
import {ReactElement} from "react";
import {isTranslatedMatch, RouterI18n, TranslatedLocation, TranslatedMatch, WithLinguiRouter} from "./LinguiRouter";
import {flatten} from 'ramda';


export interface RouteChildrenProps<T = {}> extends RRRouteChildrenProps<T> {
  location: TranslatedLocation
  match: TranslatedMatch<T>
}

export interface RouteComponentProps<T = {}> extends RRRouteComponentProps<T> {
  location: TranslatedLocation
  match: TranslatedMatch<T>
}

export interface RouteProps<T = any> extends RRRouteProps {
  component?: React.ComponentType<RouteComponentProps<T>> | React.ComponentType<any>;
  render?: ((props: RouteComponentProps<T>) => React.ReactNode);
  children?: ((props: RouteChildrenProps<T>) => React.ReactNode) | React.ReactNode;

  location?: TranslatedLocation
  computedMatch?: TranslatedMatch<T> // Match computed by a switch component Switch above
}

function renderRoutePair(routerI18n: RouterI18n, routeContext: RRRouteChildrenProps, props: RouteProps): [ReactElement<RouteProps>, ReactElement<RouteProps>] {
  const {path, component, render, children, ...otherProps} = props;
  const location = otherProps.location || routerI18n.normalizeLocation(routeContext.location);

  let match: TranslatedMatch<any> | null;
  if (otherProps.computedMatch) {
    match = otherProps.computedMatch;
  } else if (!path && isTranslatedMatch(routeContext.match)) {
    match = routeContext.match;
  } else {
    match = routerI18n.matchTranslated(location.pathname);
  }

  const routeProps: RouteProps = {...props, location, computedMatch: match || undefined};

  const key = Array.isArray(path) ? path.join(';') : path;
  return [
    <RRRoute path={routerI18n.route(path)} key={`${key || 'route'}-i18n`} {...routeProps}/>,
    <RRRoute path={path} key={key || 'route'} {...routeProps}/>,
  ]
}

export const Route = (props: RouteProps) => (
  <WithLinguiRouter>{(routerI18n) => (
    <RRRoute>{(routeComponentProps) => renderRoutePair(routerI18n, routeComponentProps, props)}</RRRoute>
  )}</WithLinguiRouter>
);

export const Switch = ({children}: SwitchProps) => (
  <WithLinguiRouter>{(routerI18n) => (
    <RRRoute>{(routeComponentProps) => {
      flatten(
        React.Children.map(children, (el) =>
          React.isValidElement(el)
            ? renderRoutePair(routerI18n, routeComponentProps, el.props)
            : el
        )
      )
    }}</RRRoute>
  )}</WithLinguiRouter>
);
