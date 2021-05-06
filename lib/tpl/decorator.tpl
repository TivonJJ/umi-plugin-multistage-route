import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import type { RouteComponentProps } from 'react-router';

export type RuRouteWrapperConfig = {
    onResume?: (match: any) => void;
    forceRender?: boolean;
};

type RuRouteRenderProps = {
    child: any;
} & RuRouteWrapperConfig & RouteComponentProps;

const RouteRender: React.FC<RuRouteRenderProps> = (props) => {
    const { children: root, onResume, forceRender = false } = props;
    const { child: children } = props;
    const isRoot = props.match.isExact;
    const [shouldRenderRoot, setShouldRenderRoot] = useState<boolean>(isRoot);
    useEffect(() => {
        if (props.match.isExact) {
            if (!shouldRenderRoot) setShouldRenderRoot(true);
            if (onResume) onResume(props.match);
        }
    }, [props.match.isExact]);
    return (
        <>
            {(shouldRenderRoot || forceRender) && (
                <div style={{ display: isRoot ? '' : 'none' }}>{root}</div>
            )}
            {!isRoot && <div>{children}</div>}
        </>
    );
};

function createRouteWrapper(
    options: RuRouteWrapperConfig = {},
    RootComponent: React.FC | React.ComponentClass,
) {
    return withRouter((props) => {
        return (
            <RouteRender
                child={props.children}
                forceRender={options.forceRender}
                onResume={options.onResume}
                {...props}
            >
                <RootComponent {...props} />
            </RouteRender>
        );
    });
}

export default function RuRouteWrapper(options?: RuRouteWrapperConfig) {
    return (RootComponent: React.FC<any> | React.ComponentClass) => {
        return createRouteWrapper(options, RootComponent);
    };
}
