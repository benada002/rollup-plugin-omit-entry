import { rollup } from 'rollup';
import postcss from 'rollup-plugin-postcss';
import omitEntry from './index';

const extensions = ['.css', '.styl', '.scss', '.sass', '.less'];

async function build(pluginOptions = {}, input = './test/assets/test.css'){
    const build = await rollup({
        input,
        cache: false,
        plugins: [
            omitEntry(pluginOptions),
            postcss({
                extract: true
            }),
        ]
    });
    return {
        generate: async () => build.generate({
            dir: './test/dist'
        }),
        write: async () => build.write({
            dir: './test/dist'
        }),
    };
}

describe('rollup-non-js-entry', () => {
    it('should omit entry chunk', async () => {
        const { generate, write } = await build();

        const {output: generateOutput} = await generate();
        const {output: writeOutput} = await write();

        expect(generateOutput).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        );

        expect(writeOutput).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        )
    });

    it('should omit entry chunk on write if onlyOnWrite is true', async () => {
        const { write } = await build({onlyOnWrite: true});
        const {output: writeOutput} = await write();

        expect(writeOutput).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        )
    });

    it('should not omit entry chunk on generate if onlyOnWrite is true', async () => {
        const { generate } = await build({onlyOnWrite: true});
        const {output: generateOutput} = await generate();

        expect(generateOutput).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        );
    });

    it('should omit entry chunk if extensions are matched', async () => {
        const { generate, write } = await build({extensions});

        const {output: generateOutput} = await generate();
        const {output: writeOutput} = await write();

        expect(generateOutput).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        );

        expect(writeOutput).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        )
    });

    it('should not omit entry chunk if extensions are not matched', async () => {
        const { generate, write } = await build({extensions}, './test/assets/test.js');

        const {output: generateOutput} = await generate();
        const {output: writeOutput} = await write();

        expect(generateOutput).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        );

        expect(writeOutput).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    isEntry: true
                })
            ])
        )
    });
});