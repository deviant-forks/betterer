import { React, render } from '@betterer/render';
import { Command } from 'commander';
import path from 'path';

import { Init } from './init/init';
import { initCommand, setEnv } from './options';
import { BettererCLIInitConfig } from './types';

const BETTERER_TS = './.betterer.ts';
const BETTERER_RESULTS = './.betterer.results';
const TS_EXTENSION = '.ts';

/**
 * Run the **Betterer** `init` command to initialise **Betterer** in a new project.
 */
export function init(cwd: string): Command {
  const command = initCommand();
  command.description('init Betterer in a project');
  command.action(async (config: BettererCLIInitConfig): Promise<void> => {
    setEnv(config);

    const RENDER_OPTIONS = {
      debug: process.env.NODE_ENV === 'test'
    };

    const finalConfig = config.config || BETTERER_TS;
    const finalResults = config.results || BETTERER_RESULTS;
    const ext = path.extname(finalConfig);
    const ts = ext === TS_EXTENSION;

    const app = render(
      <Init automerge={config.automerge} configPath={finalConfig} cwd={cwd} resultsPath={finalResults} ts={ts} />,
      RENDER_OPTIONS
    );
    await app.waitUntilExit();
  });

  return command;
}
