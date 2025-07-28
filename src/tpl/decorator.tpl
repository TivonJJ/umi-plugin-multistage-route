import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useOutlet } from 'umi';

export type RouteWrapperConfig = {
    onResume?: () => void;
    forceRender?: boolean;
};

const RouteRender = (props: PropsWithChildren<RouteWrapperConfig>) => {
    const { children, onResume, forceRender = false } = props;
    const outlet = useOutlet();
    const isRoot = !outlet;
    const [shouldRenderRoot, setShouldRenderRoot] = useState<boolean>(isRoot);

    useEffect(() => {
        if (!outlet && !shouldRenderRoot) {
            setShouldRenderRoot(true);
            if (onResume) onResume();
            document.dispatchEvent(new CustomEvent('multistage-route-resume'));
        }
    }, [outlet]);

    return (
        <>
            {(shouldRenderRoot || forceRender) && (
                <div style={{ display: isRoot ? '' : 'none' }} className={'multistage-route multistage-route_root'}>{children}</div>
            )}
            {!isRoot && <div className={'multistage-route multistage-route_outlet'}>{outlet}</div>}
        </>
    );
};

function createRouteWrapper(
    options: RouteWrapperConfig = {},
    RootComponent: React.FC | React.ComponentClass,
) {
    return (props: any) => {
        return (
            <RouteRender forceRender={options.forceRender} onResume={options.onResume}>
                <RootComponent {...props} />
            </RouteRender>
        );
    };
}

export default function RouteWrapper(options?: RouteWrapperConfig) {
    return (RootComponent: React.FC<any> | React.ComponentClass) => {
        return createRouteWrapper(options, RootComponent);
    };
}
