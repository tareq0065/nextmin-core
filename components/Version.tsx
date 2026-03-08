import pack from '../package.json';

export function Version({ prefix = 'v' }: { prefix?: string }) {
    return <>{prefix}{pack.version}</>;
}
