const z = require('zod');
const { EModelEndpoint } = require('librechat-data-provider');

const models = [
  'text-davinci-003',
  'text-davinci-002',
  'text-davinci-001',
  'text-curie-001',
  'text-babbage-001',
  'text-ada-001',
  'davinci',
  'curie',
  'babbage',
  'ada',
  'code-davinci-002',
  'code-davinci-001',
  'code-cushman-002',
  'code-cushman-001',
  'davinci-codex',
  'cushman-codex',
  'text-davinci-edit-001',
  'code-davinci-edit-001',
  'text-embedding-ada-002',
  'text-similarity-davinci-001',
  'text-similarity-curie-001',
  'text-similarity-babbage-001',
  'text-similarity-ada-001',
  'text-search-davinci-doc-001',
  'text-search-curie-doc-001',
  'text-search-babbage-doc-001',
  'text-search-ada-doc-001',
  'code-search-babbage-code-001',
  'code-search-ada-code-001',
  'gpt2',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-4o',
];

const openAIModels = {
  'gpt-4': 8187, // -5 from max
  'gpt-4-0613': 8187, // -5 from max
  'gpt-4-32k': 32758, // -10 from max
  'gpt-4-32k-0314': 32758, // -10 from max
  'gpt-4-32k-0613': 32758, // -10 from max
  'gpt-4-1106': 127990, // -10 from max
  'gpt-4-0125': 127990, // -10 from max
  'gpt-4o': 127990, // -10 from max
  'gpt-4-turbo': 127990, // -10 from max
  'gpt-4-vision': 127990, // -10 from max
  'gpt-3.5-turbo': 16375, // -10 from max
  'gpt-3.5-turbo-0613': 4092, // -5 from max
  'gpt-3.5-turbo-0301': 4092, // -5 from max
  'gpt-3.5-turbo-16k': 16375, // -10 from max
  'gpt-3.5-turbo-16k-0613': 16375, // -10 from max
  'gpt-3.5-turbo-1106': 16375, // -10 from max
  'gpt-3.5-turbo-0125': 16375, // -10 from max
  'mistral-': 31990, // -10 from max
  llama3: 8187, // -5 from max
  'llama-3': 8187, // -5 from max
};

const cohereModels = {
  'command-light': 4086, // -10 from max
  'command-light-nightly': 8182, // -10 from max
  'command-nightly': 8182, // -10 from max
  'command-r': 127500, // -500 from max
  'command-r-plus': 127500, // -500 from max
};

const googleModels = {
  /* Max I/O is combined so we subtract the amount from max response tokens for actual total */
  gemini: 30720, // -2048 from max
  'gemini-pro-vision': 12288, // -4096 from max
  'gemini-1.5': 1048576, // -8192 from max
  'text-bison-32k': 32758, // -10 from max
  'chat-bison-32k': 32758, // -10 from max
  'code-bison-32k': 32758, // -10 from max
  'codechat-bison-32k': 32758,
  /* Codey, -5 from max: 6144 */
  //'code-': 6139,
  //'codechat-': 6139,
  /* PaLM2, -5 from max: 8192 */
  //'text-': 8187,
  //'chat-': 8187,
};

const anthropicModels = {
  'claude-': 100000,
  'claude-2': 100000,
  'claude-2.1': 200000,
  'claude-3-haiku': 200000,
  'claude-3-sonnet': 200000,
  'claude-3-opus': 200000,
  'claude-3-5-sonnet': 200000,
};

const otherModels = {
  'deepseek-chat': 32758,
  'deepseek-coder': 32758,
  'yi-large': 32758,
  'yi-medium': 16375,
  'yi-vision': 4086,
  'yi-medium-200k': 200000,
  'yi-spark': 16375,
  'yi-large-rag': 16375,
  'yi-large-turbo': 16375,
};

const openrouterModels = {
  'anthropic/claude-3.5-sonnet:beta': 199990,
  'qwen/qwen-2-72b-instruct': 32758,
  'liuhaotian/llava-yi-34b': 4086,
  'qwen/qwen-72b-chat': 32758,
  'qwen/qwen-110b-chat': 32758,
  'qwen/qwen-32b-chat': 32758,
  'qwen/qwen-14b-chat': 32758,
  'qwen/qwen-7b-chat': 32758,
  'qwen/qwen-4b-chat': 32758,
  'mistralai/mixtral-8x22b-instruct': 65526,
  'meta-llama/llama-3-70b-instruct:nitro': 8182,
  'meta-llama/llama-3-70b-instruct': 8182,
  'google/gemini-pro-1.5': 2790000,
  'microsoft/wizardlm-2-7b': 31990,
  'microsoft/wizardlm-2-8x22b:nitro': 65526,
  'nousresearch/nous-capybara-7b:free': 4086,
  'mistralai/mistral-7b-instruct:free': 32758,
  'gryphe/mythomist-7b:free': 32758,
  'undi95/toppy-m-7b:free': 4086,
  'openrouter/cinematika-7b:free': 7990,
  'google/gemma-7b-it:free': 8182,
  'jebcarter/psyfighter-13b': 4086,
  'koboldai/psyfighter-13b-2': 4086,
  'nousresearch/nous-hermes-llama2-13b': 4086,
  'meta-llama/codellama-34b-instruct': 8182,
  'phind/phind-codellama-34b': 4086,
  'intel/neural-chat-7b': 4086,
  'nousresearch/nous-hermes-2-mixtral-8x7b-dpo': 31990,
  'nousresearch/nous-hermes-2-mixtral-8x7b-sft': 31990,
  'haotian-liu/llava-13b': 2038,
  'nousresearch/nous-hermes-2-vision-7b': 4086,
  'meta-llama/llama-2-13b-chat': 4086,
  'migtissera/synthia-70b': 8182,
  'pygmalionai/mythalion-13b': 8182,
  'gryphe/mythomax-l2-13b': 4086,
  'xwin-lm/xwin-lm-70b': 8182,
  'alpindale/goliath-120b': 6134,
  'neversleep/noromaid-20b': 8182,
  'gryphe/mythomist-7b': 32758,
  'sophosympatheia/midnight-rose-70b': 4086,
  'undi95/remm-slerp-l2-13b:extended': 6134,
  'gryphe/mythomax-l2-13b:extended': 8182,
  'mancer/weaver': 7990,
  'nousresearch/nous-capybara-7b': 4086,
  'codellama/codellama-70b-instruct': 2038,
  'teknium/openhermes-2-mistral-7b': 4086,
  'teknium/openhermes-2.5-mistral-7b': 4086,
  'undi95/remm-slerp-l2-13b': 4086,
  'undi95/toppy-m-7b': 4086,
  'openrouter/cinematika-7b': 7990,
  '01-ai/yi-34b-chat': 4086,
  '01-ai/yi-34b': 4086,
  '01-ai/yi-6b': 4086,
  'togethercomputer/stripedhyena-nous-7b': 32758,
  'togethercomputer/stripedhyena-hessian-7b': 32758,
  'mistralai/mixtral-8x7b': 32758,
  'nousresearch/nous-hermes-yi-34b': 4086,
  'nousresearch/nous-hermes-2-mistral-7b-dpo': 8182,
  'open-orca/mistral-7b-openorca': 8182,
  'huggingfaceh4/zephyr-7b-beta': 4086,
  'openai/gpt-3.5-turbo': 16375,
  'openai/gpt-3.5-turbo-0125': 16375,
  'openai/gpt-3.5-turbo-1106': 16375,
  'openai/gpt-3.5-turbo-0613': 4085,
  'openai/gpt-3.5-turbo-0301': 4085,
  'openai/gpt-3.5-turbo-16k': 16375,
  'openai/gpt-4-turbo-preview': 127990,
  'openai/gpt-4-turbo': 127990,
  'openai/gpt-4-1106-preview': 127990,
  'openai/gpt-4': 8181,
  'openai/gpt-4-0314': 8181,
  'openai/gpt-4-32k': 32757,
  'openai/gpt-4-32k-0314': 32757,
  'openai/gpt-4-vision-preview': 127990,
  'openai/gpt-3.5-turbo-instruct': 4085,
  'google/palm-2-chat-bison': 36854,
  'google/palm-2-codechat-bison': 28662,
  'google/palm-2-chat-bison-32k': 131062,
  'google/palm-2-codechat-bison-32k': 131062,
  'google/gemini-pro': 131062,
  'google/gemini-pro-vision': 65526,
  'perplexity/pplx-70b-online': 4086,
  'perplexity/pplx-7b-online': 4086,
  'perplexity/pplx-7b-chat': 8182,
  'perplexity/pplx-70b-chat': 4086,
  'perplexity/sonar-small-chat': 16374,
  'perplexity/sonar-medium-chat': 16374,
  'perplexity/sonar-small-online': 11990,
  'perplexity/sonar-medium-online': 11990,
  'anthropic/claude-3-opus': 199990,
  'anthropic/claude-3-sonnet': 199990,
  'anthropic/claude-3-haiku': 199990,
  'anthropic/claude-3-opus:beta': 199990,
  'anthropic/claude-3-sonnet:beta': 199990,
  'anthropic/claude-3-haiku:beta': 199990,
  'meta-llama/llama-2-70b-chat': 4086,
  'nousresearch/nous-capybara-34b': 32758,
  'jondurbin/airoboros-l2-70b': 4086,
  'jondurbin/bagel-34b': 7990,
  'austism/chronos-hermes-13b': 4086,
  'mistralai/mistral-7b-instruct': 32758,
  'openchat/openchat-7b': 8182,
  'lizpreciatior/lzlv-70b-fp16-hf': 4086,
  'mistralai/mixtral-8x7b-instruct': 32758,
  'cognitivecomputations/dolphin-mixtral-8x7b': 31990,
  'neversleep/noromaid-mixtral-8x7b-instruct': 7990,
  'rwkv/rwkv-5-world-3b': 9990,
  'recursal/rwkv-5-3b-ai-town': 9990,
  'recursal/eagle-7b': 9990,
  'google/gemma-7b-it': 8182,
  'databricks/dbrx-instruct': 32758,
  'anthropic/claude-2': 199990,
  'anthropic/claude-2.1': 199990,
  'anthropic/claude-2.0': 99990,
  'anthropic/claude-instant-1': 99990,
  'anthropic/claude-instant-1.2': 99990,
  'anthropic/claude-1': 99990,
  'anthropic/claude-1.2': 99990,
  'anthropic/claude-instant-1.0': 99990,
  'anthropic/claude-instant-1.1': 99990,
  'anthropic/claude-2:beta': 199990,
  'anthropic/claude-2.1:beta': 199990,
  'anthropic/claude-2.0:beta': 99990,
  'anthropic/claude-instant-1:beta': 99990,
  'huggingfaceh4/zephyr-7b-beta:free': 4086,
  'openchat/openchat-7b:free': 8182,
  'mistralai/mixtral-8x7b-instruct:nitro': 32758,
  'meta-llama/llama-2-70b-chat:nitro': 4086,
  'gryphe/mythomax-l2-13b:nitro': 4086,
  'mistralai/mistral-7b-instruct:nitro': 32758,
  'google/gemma-7b-it:nitro': 8182,
  'databricks/dbrx-instruct:nitro': 32758,
  'mistralai/mistral-tiny': 31990,
  'mistralai/mistral-small': 31990,
  'mistralai/mistral-medium': 31990,
  'mistralai/mistral-large': 31990,
  'cohere/command': 4086,
  'cohere/command-r': 127990,
  'cohere/command-r-plus': 127990,
};
const aggregateModels = { ...openAIModels, ...googleModels, ...anthropicModels, ...cohereModels };

// Order is important here: by model series and context size (gpt-4 then gpt-3, ascending)
const maxTokensMap = {
  [EModelEndpoint.azureOpenAI]: openAIModels,
  [EModelEndpoint.openAI]: aggregateModels,
  [EModelEndpoint.custom]: {
    ...openrouterModels,
    ...openAIModels,
    ...googleModels,
    ...anthropicModels,
    ...cohereModels,
    ...otherModels,
  },
  [EModelEndpoint.google]: googleModels,
  [EModelEndpoint.anthropic]: anthropicModels,
};

/**
 * Retrieves the maximum tokens for a given model name. If the exact model name isn't found,
 * it searches for partial matches within the model name, checking keys in reverse order.
 *
 * @param {string} modelName - The name of the model to look up.
 * @param {string} endpoint - The endpoint (default is 'openAI').
 * @param {EndpointTokenConfig} [endpointTokenConfig] - Token Config for current endpoint to use for max tokens lookup
 * @returns {number|undefined} The maximum tokens for the given model or undefined if no match is found.
 *
 * @example
 * getModelMaxTokens('gpt-4-32k-0613'); // Returns 32767
 * getModelMaxTokens('gpt-4-32k-unknown'); // Returns 32767
 * getModelMaxTokens('unknown-model'); // Returns undefined
 */
function getModelMaxTokens(modelName, endpoint = EModelEndpoint.openAI, endpointTokenConfig) {
  if (typeof modelName !== 'string') {
    return undefined;
  }

  /** @type {EndpointTokenConfig | Record<string, number>} */
  const tokensMap = endpointTokenConfig ?? maxTokensMap[endpoint];
  if (!tokensMap) {
    return undefined;
  }

  if (tokensMap[modelName]?.context) {
    return tokensMap[modelName].context;
  }

  if (tokensMap[modelName]) {
    return tokensMap[modelName];
  }

  // not compatiable to openrouter
  const keys = Object.keys(tokensMap);
  for (let i = keys.length - 1; i >= 0; i--) {
    if (modelName.includes(keys[i])) {
      const result = tokensMap[keys[i]];
      return result?.context ?? result;
    }
  }

  return undefined;
}

/**
 * Retrieves the model name key for a given model name input. If the exact model name isn't found,
 * it searches for partial matches within the model name, checking keys in reverse order.
 *
 * @param {string} modelName - The name of the model to look up.
 * @param {string} endpoint - The endpoint (default is 'openAI').
 * @returns {string|undefined} The model name key for the given model; returns input if no match is found and is string.
 *
 * @example
 * matchModelName('gpt-4-32k-0613'); // Returns 'gpt-4-32k-0613'
 * matchModelName('gpt-4-32k-unknown'); // Returns 'gpt-4-32k'
 * matchModelName('unknown-model'); // Returns undefined
 */
function matchModelName(modelName, endpoint = EModelEndpoint.openAI) {
  if (typeof modelName !== 'string') {
    return undefined;
  }

  const tokensMap = maxTokensMap[endpoint];
  if (!tokensMap) {
    return modelName;
  }

  if (tokensMap[modelName]) {
    return modelName;
  }

  // not compatiable to openrouter
  //const keys = Object.keys(tokensMap);
  //for (let i = keys.length - 1; i >= 0; i--) {
  //  const modelKey = keys[i];
  //  if (modelName.includes(modelKey)) {
  //    return modelKey;
  //  }
  //}

  return modelName;
}

const modelSchema = z.object({
  id: z.string(),
  pricing: z.object({
    prompt: z.string(),
    completion: z.string(),
  }),
  context_length: z.number(),
});

const inputSchema = z.object({
  data: z.array(modelSchema),
});

/**
 * Processes a list of model data from an API and organizes it into structured data based on URL and specifics of rates and context.
 * @param {{ data: Array<z.infer<typeof modelSchema>> }} input The input object containing base URL and data fetched from the API.
 * @returns {EndpointTokenConfig} The processed model data.
 */
function processModelData(input) {
  const validationResult = inputSchema.safeParse(input);
  if (!validationResult.success) {
    throw new Error('Invalid input data');
  }
  const { data } = validationResult.data;

  /** @type {EndpointTokenConfig} */
  const tokenConfig = {};

  for (const model of data) {
    const modelKey = model.id;
    if (modelKey === 'openrouter/auto') {
      model.pricing = {
        prompt: '0.00001',
        completion: '0.00003',
      };
    }
    const prompt = parseFloat(model.pricing.prompt) * 1000000;
    const completion = parseFloat(model.pricing.completion) * 1000000;

    tokenConfig[modelKey] = {
      prompt,
      completion,
      context: model.context_length,
    };
  }

  return tokenConfig;
}

module.exports = {
  tiktokenModels: new Set(models),
  maxTokensMap,
  inputSchema,
  modelSchema,
  getModelMaxTokens,
  matchModelName,
  processModelData,
};
