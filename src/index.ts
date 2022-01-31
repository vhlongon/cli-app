#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import * as fs from 'fs';
import inquirer, { QuestionTypeName } from 'inquirer';
import { createSpinner } from 'nanospinner';
import path from 'path';

const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms));

type Language = 'JavaScript' | 'TypeScript' | 'Java' | 'C#' | 'Python' | 'Ruby';
type Focus = 'Frontend' | 'Backend' | 'Fullstack';

interface Data {
  name: string;
  age: number;
  focus: Focus;
  languages: Language[];
}

type Question<T> = {
  [key in keyof T]?: {
    default?: T[key];
    type: QuestionTypeName;
    name: key;
    choices?: T[key][] | T[key];
  };
};

async function welcome() {
  const title = chalkAnimation.glitch('Dev survey');
  await sleep();
  title.stop();
  console.log(chalk.black.bgGreen.bold('Fill in some info about you'));
}

const questions: Question<Data> = {
  name: { default: 'Your name', type: 'input', name: 'name' },
  age: { default: 39, type: 'input', name: 'age' },
  focus: {
    default: 'Frontend',
    type: 'list',
    name: 'focus',
    choices: ['Frontend', 'Backend', 'Fullstack'],
  },
  languages: {
    default: ['JavaScript'],
    type: 'checkbox',
    name: 'languages',
    choices: ['JavaScript', 'TypeScript', 'Java', 'C#', 'Python', 'Ruby'],
  },
};

const askQuestions = async (questions: Question<Data>): Promise<Data> => {
  const promptModule = inquirer.createPromptModule();
  const anwsers = await promptModule(Object.values(questions));
  return anwsers;
};

const spinner = createSpinner();
const createFile = async (answers: Data) => {
  spinner.start({ text: 'Saving data...', color: 'yellow' });
  await sleep();
  fs.writeFileSync('./data.json', JSON.stringify(answers, null, 2));
  spinner.success({ text: 'Data saved!' });
};

const promptDone = () => {
  figlet('Done!', { font: 'Chunky' }, (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);
    const fullPath = path.resolve(__dirname, '../data.json');
    console.log(chalk.black.bgGreen.bold(`file created at ${fullPath}`));
    process.exit(0);
  });
};

async function init() {
  console.clear();
  await welcome();
  await sleep();
  const answers = await askQuestions(questions);
  await createFile(answers);
  promptDone();
}

init();
