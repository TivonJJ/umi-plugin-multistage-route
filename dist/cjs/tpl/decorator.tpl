import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useOutlet } from 'umi';

export type RuRouteWrapperConfig = {
    onResume?: () => void;
    forceRender?: boolean;
};

const RouteRender = (props: PropsWithChildren<RuRouteWrapperConfig>) => {
    const { children, onResume, forceRender = false } = props;
    const outlet = useOutlet();
    const isRoot = !outlet;
    const [shouldRenderRoot, setShouldRenderRoot] = useState<boolean>(isRoot);

    useEffect(() => {
        if (!outlet && !shouldRenderRoot) {
            setShouldRenderRoot(true);
            if (onResume) onResume();
        }
    }, [outlet]);

    return (
        <>
            {(shouldRenderRoot || forceRender) && (
                <div style={{ display: isRoot ? '' : 'none' }}>{children}</div>
            )}
            {!isRoot && <div>{outlet}</div>}
        </>
    );
};

function createRouteWrapper(
    options: RuRouteWrapperConfig = {},
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

export default function RuRouteWrapper(options?: RuRouteWrapperConfig) {
    return (RootComponent: React.FC<any> | React.ComponentClass) => {
        return createRouteWrapper(options, RootComponent);
    };
}
