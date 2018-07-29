# Serverless-Image-Resizer

[Serverless Framework-based](https://www.github.com/serverless/serverless) AWS Lambda function triggered by S3 events to resize images with the excellent [Sharp](https://github.com/lovell/sharp) module. By using the Sharp module (which uses the libvips library), image processing can be 3x-5x faster than using ImageMagick, thus reducing the time your function spends running, which can potentially dramatically decrease your lambda function's cost. The function's behaviour can be controlled entirely with configuration.

This is based on the following projects:

- https://github.com/Jaikant/lambda-image-sharp, which is based on
- https://github.com/adieuadieu/retinal, see https://github.com/adieuadieu/retinal/issues/59
- https://github.com/danielstaleiny/serverless-example, which is based on
- https://github.com/keboola/developer-portal, see https://github.com/serverless-heaven/serverless-webpack/issues/396

## Contents

1. [What is it?](#what-is-it)
1. [Installation](#installation)
1. [Setup](#setup)
1. [Testing](#testing)
1. [Local Invokation](#local-invokation)
1. [Deployment](#deployment)


## What is it?
A tool to take images uploaded to an S3 bucket and produce one or more images of varying sizes, optimizations and other operations. It does this by creating an AWS Lambda function with the help of the [Serverless Framework](https://www.github.com/serverless/serverless).
It uses Docker to build the sharp library and then deploys the Lambda function from within docker.

## Installation

Installation can be achieved with the following commands

```bash
git clone https://github.com/einselbst/serverless-image-resizer
cd serverless-image-resizer
yarn install
```

(It is possible to exchange `yarn` for `npm` if `yarn` is too hipster for your taste. No problem.)

Or, if you have `serverless` installed globally:

```bash
serverless install -u https://github.com/einselbst/serverless-image-resizer
```

Then, modify the `config.js` and `event.json` files, adapting them to your needs. More on configuration [below](#configuration).


## Setup

### Credentials

You must configure your AWS credentials by defining `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environmental variables.

In short:

```bash
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

## Testing

Make sure the bucket in `config.js` exists.

We use Jest to run our tests. You can read more about setting up your tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content).


Then:

```bash
yarn test
```

You can also try out the service by invoking it. First deploy it with `yarn run deploy` and then you can invoke your function with `yarn run invoke`. This will invoke the function with the test event in `event.json`. You may need to tweak this file to match your setup.

## Local Invokation

To run a function on your local

``` bash
$ serverless invoke local --function hello
```

To simulate API Gateway locally using [serverless-offline](https://github.com/dherault/serverless-offline)

``` bash
$ serverless offline start
```

## Deployment

Deploy your project

``` bash
$ yarn run deploy
```

This will call `docker-compose run deploy`.

Deploy a single function

``` bash
$ serverless deploy function --function hello
```
