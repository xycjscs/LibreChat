const { matchModelName } = require('../utils');
const defaultRate = 6;

/**
 * Mapping of model token sizes to their respective multipliers for prompt and completion.
 * The rates are 1 USD per 1M tokens.
 * @type {Object.<string, {prompt: number, completion: number}>}
 */
const tokenValues = {
  'gpt-3.5-turbo': { prompt: 0.5, completion: 1.5 },
  'gpt-4-turbo': { prompt: 10, completion: 30 },
  'gpt-4-vsion': { prompt: 10, completion: 30 },
  'claude-3-opus': { prompt: 15, completion: 75 },
  'claude-3-sonnet': { prompt: 3, completion: 15 },
  'claude-3-haiku': { prompt: 0.25, completion: 1.25 },
  'claude-2.1': { prompt: 8, completion: 24 },
  'claude-2': { prompt: 8, completion: 24 },
  'claude-': { prompt: 0.8, completion: 2.4 },
  //openrouter models
  'nousresearch/nous-capybara-7b:free': { prompt: 0.0, completion: 0.0 },
  'mistralai/mistral-7b-instruct:free': { prompt: 0.0, completion: 0.0 },
  'gryphe/mythomist-7b:free': { prompt: 0.0, completion: 0.0 },
  'undi95/toppy-m-7b:free': { prompt: 0.0, completion: 0.0 },
  'openrouter/cinematika-7b:free': { prompt: 0.0, completion: 0.0 },
  'google/gemma-7b-it:free': { prompt: 0.0, completion: 0.0 },
  'jebcarter/psyfighter-13b': { prompt: 1.0, completion: 1.0 },
  'koboldai/psyfighter-13b-2': { prompt: 1.0, completion: 1.0 },
  'nousresearch/nous-hermes-llama2-13b': { prompt: 0.15, completion: 0.15 },
  'meta-llama/codellama-34b-instruct': { prompt: 0.4, completion: 0.4 },
  'phind/phind-codellama-34b': { prompt: 0.4, completion: 0.4 },
  'intel/neural-chat-7b': { prompt: 5.0, completion: 5.0 },
  'nousresearch/nous-hermes-2-mixtral-8x7b-dpo': { prompt: 0.3, completion: 0.3 },
  'nousresearch/nous-hermes-2-mixtral-8x7b-sft': { prompt: 0.3, completion: 0.3 },
  'haotian-liu/llava-13b': { prompt: 5.0, completion: 5.0 },
  'nousresearch/nous-hermes-2-vision-7b': { prompt: 5.0, completion: 5.0 },
  'meta-llama/llama-2-13b-chat': { prompt: 0.147, completion: 0.147 },
  'migtissera/synthia-70b': { prompt: 3.75, completion: 3.75 },
  'pygmalionai/mythalion-13b': { prompt: 1.125, completion: 1.125 },
  'gryphe/mythomax-l2-13b': { prompt: 0.225, completion: 0.225 },
  'xwin-lm/xwin-lm-70b': { prompt: 3.75, completion: 3.75 },
  'alpindale/goliath-120b': { prompt: 9.375, completion: 9.375 },
  'neversleep/noromaid-20b': { prompt: 2.25, completion: 2.25 },
  'gryphe/mythomist-7b': { prompt: 0.375, completion: 0.375 },
  'sophosympatheia/midnight-rose-70b': { prompt: 9.0, completion: 9.0 },
  'undi95/remm-slerp-l2-13b:extended': { prompt: 1.125, completion: 1.125 },
  'gryphe/mythomax-l2-13b:extended': { prompt: 1.125, completion: 1.125 },
  'mancer/weaver': { prompt: 3.375, completion: 3.375 },
  'nousresearch/nous-capybara-7b': { prompt: 0.18, completion: 0.18 },
  'codellama/codellama-70b-instruct': { prompt: 0.81, completion: 0.81 },
  'teknium/openhermes-2-mistral-7b': { prompt: 0.18, completion: 0.18 },
  'teknium/openhermes-2.5-mistral-7b': { prompt: 0.18, completion: 0.18 },
  'undi95/remm-slerp-l2-13b': { prompt: 0.27, completion: 0.27 },
  'undi95/toppy-m-7b': { prompt: 0.18, completion: 0.18 },
  'openrouter/cinematika-7b': { prompt: 0.18, completion: 0.18 },
  '01-ai/yi-34b-chat': { prompt: 0.72, completion: 0.72 },
  '01-ai/yi-34b': { prompt: 0.72, completion: 0.72 },
  '01-ai/yi-6b': { prompt: 0.126, completion: 0.126 },
  'togethercomputer/stripedhyena-nous-7b': { prompt: 0.18, completion: 0.18 },
  'togethercomputer/stripedhyena-hessian-7b': { prompt: 0.18, completion: 0.18 },
  'mistralai/mixtral-8x7b': { prompt: 0.54, completion: 0.54 },
  'nousresearch/nous-hermes-yi-34b': { prompt: 0.72, completion: 0.72 },
  'nousresearch/nous-hermes-2-mistral-7b-dpo': { prompt: 0.18, completion: 0.18 },
  'open-orca/mistral-7b-openorca': { prompt: 0.143, completion: 0.143 },
  'huggingfaceh4/zephyr-7b-beta': { prompt: 0.143, completion: 0.143 },
  'openai/gpt-3.5-turbo': { prompt: 0.5, completion: 1.5 },
  'openai/gpt-3.5-turbo-0125': { prompt: 0.5, completion: 1.5 },
  'openai/gpt-3.5-turbo-1106': { prompt: 1.0, completion: 2.0 },
  'openai/gpt-3.5-turbo-0613': { prompt: 1.0, completion: 2.0 },
  'openai/gpt-3.5-turbo-0301': { prompt: 1.0, completion: 2.0 },
  'openai/gpt-3.5-turbo-16k': { prompt: 3.0, completion: 4.0 },
  'openai/gpt-4-turbo-preview': { prompt: 10.0, completion: 30.0 },
  'openai/gpt-4-turbo': { prompt: 10.0, completion: 30.0 },
  'openai/gpt-4-1106-preview': { prompt: 10.0, completion: 30.0 },
  'openai/gpt-4': { prompt: 30.0, completion: 60.0 },
  'openai/gpt-4-0314': { prompt: 30.0, completion: 60.0 },
  'openai/gpt-4-32k': { prompt: 60.0, completion: 120.0 },
  'openai/gpt-4-32k-0314': { prompt: 60.0, completion: 120.0 },
  'openai/gpt-4-vision-preview': { prompt: 10.0, completion: 30.0 },
  'openai/gpt-3.5-turbo-instruct': { prompt: 1.5, completion: 2.0 },
  'google/palm-2-chat-bison': { prompt: 0.25, completion: 0.5 },
  'google/palm-2-codechat-bison': { prompt: 0.25, completion: 0.5 },
  'google/palm-2-chat-bison-32k': { prompt: 0.25, completion: 0.5 },
  'google/palm-2-codechat-bison-32k': { prompt: 0.25, completion: 0.5 },
  'google/gemini-pro': { prompt: 0.125, completion: 0.375 },
  'google/gemini-pro-vision': { prompt: 0.125, completion: 0.375 },
  'perplexity/pplx-70b-online': { prompt: 1.0, completion: 1.0 },
  'perplexity/pplx-7b-online': { prompt: 0.2, completion: 0.2 },
  'perplexity/pplx-7b-chat': { prompt: 0.2, completion: 0.2 },
  'perplexity/pplx-70b-chat': { prompt: 1.0, completion: 1.0 },
  'perplexity/sonar-small-chat': { prompt: 0.2, completion: 0.2 },
  'perplexity/sonar-medium-chat': { prompt: 0.6, completion: 0.6 },
  'perplexity/sonar-small-online': { prompt: 0.2, completion: 0.2 },
  'perplexity/sonar-medium-online': { prompt: 0.6, completion: 0.6 },
  'anthropic/claude-3-opus': { prompt: 15.0, completion: 75.0 },
  'anthropic/claude-3-sonnet': { prompt: 3.0, completion: 15.0 },
  'anthropic/claude-3-haiku': { prompt: 0.25, completion: 1.25 },
  'anthropic/claude-3-opus:beta': { prompt: 15.0, completion: 75.0 },
  'anthropic/claude-3-sonnet:beta': { prompt: 3.0, completion: 15.0 },
  'anthropic/claude-3-haiku:beta': { prompt: 0.25, completion: 1.25 },
  'meta-llama/llama-2-70b-chat': { prompt: 0.7, completion: 0.9 },
  'nousresearch/nous-capybara-34b': { prompt: 0.9, completion: 0.9 },
  'jondurbin/airoboros-l2-70b': { prompt: 0.7, completion: 0.9 },
  'jondurbin/bagel-34b': { prompt: 5.75, completion: 5.75 },
  'austism/chronos-hermes-13b': { prompt: 0.22, completion: 0.22 },
  'mistralai/mistral-7b-instruct': { prompt: 0.13, completion: 0.13 },
  'openchat/openchat-7b': { prompt: 0.13, completion: 0.13 },
  'lizpreciatior/lzlv-70b-fp16-hf': { prompt: 0.7, completion: 0.9 },
  'mistralai/mixtral-8x7b-instruct': { prompt: 0.27, completion: 0.27 },
  'cognitivecomputations/dolphin-mixtral-8x7b': { prompt: 0.5, completion: 0.5 },
  'neversleep/noromaid-mixtral-8x7b-instruct': { prompt: 8.0, completion: 8.0 },
  'rwkv/rwkv-5-world-3b': { prompt: 0.0, completion: 0.0 },
  'recursal/rwkv-5-3b-ai-town': { prompt: 0.0, completion: 0.0 },
  'recursal/eagle-7b': { prompt: 0.0, completion: 0.0 },
  'google/gemma-7b-it': { prompt: 0.13, completion: 0.13 },
  'databricks/dbrx-instruct': { prompt: 0.9, completion: 0.9 },
  'anthropic/claude-2': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-2.1': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-2.0': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-instant-1': { prompt: 0.8, completion: 2.4 },
  'anthropic/claude-instant-1.2': { prompt: 0.8, completion: 2.4 },
  'anthropic/claude-1': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-1.2': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-instant-1.0': { prompt: 0.8, completion: 2.4 },
  'anthropic/claude-instant-1.1': { prompt: 0.8, completion: 2.4 },
  'anthropic/claude-2:beta': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-2.1:beta': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-2.0:beta': { prompt: 8.0, completion: 24.0 },
  'anthropic/claude-instant-1:beta': { prompt: 0.8, completion: 2.4 },
  'huggingfaceh4/zephyr-7b-beta:free': { prompt: 0.0, completion: 0.0 },
  'openchat/openchat-7b:free': { prompt: 0.0, completion: 0.0 },
  'mistralai/mixtral-8x7b-instruct:nitro': { prompt: 0.5, completion: 0.5 },
  'meta-llama/llama-2-70b-chat:nitro': { prompt: 0.9, completion: 0.9 },
  'gryphe/mythomax-l2-13b:nitro': { prompt: 0.2, completion: 0.2 },
  'mistralai/mistral-7b-instruct:nitro': { prompt: 0.2, completion: 0.2 },
  'google/gemma-7b-it:nitro': { prompt: 0.2, completion: 0.2 },
  'databricks/dbrx-instruct:nitro': { prompt: 0.9, completion: 0.9 },
  'mistralai/mistral-tiny': { prompt: 0.25, completion: 0.25 },
  'mistralai/mistral-small': { prompt: 2.0, completion: 6.0 },
  'mistralai/mistral-medium': { prompt: 2.7, completion: 8.1 },
  'mistralai/mistral-large': { prompt: 8.0, completion: 24.0 },
  'cohere/command': { prompt: 1.0, completion: 2.0 },
  'cohere/command-r': { prompt: 0.5, completion: 1.5 },
  'cohere/command-r-plus': { prompt: 3.0, completion: 15.0 },
  'command-r-plus': { prompt: 3, completion: 15 },
  'command-r': { prompt: 0.5, completion: 1.5 },
};

/**
 * Retrieves the key associated with a given model name.
 *
 * @param {string} model - The model name to match.
 * @param {string} endpoint - The endpoint name to match.
 * @returns {string|undefined} The key corresponding to the model name, or undefined if no match is found.
 */
const getValueKey = (model, endpoint) => {
  const modelName = matchModelName(model, endpoint);

  //console.log(modelName)
  if (!modelName) {
    return undefined;
  }

  if (modelName.includes('gpt-3.5-turbo')) {
    return 'gpt-3.5-turbo';
  } else if (modelName.includes('gpt-4-turbo')) {
    return 'gpt-4-turbo';
  } else if (modelName.includes('gpt-4-vision')) {
    return 'gpt-4-vision';
  } else if (tokenValues[modelName]) {
    return modelName;
  }

  return undefined;
};

/**
 * Retrieves the multiplier for a given value key and token type. If no value key is provided,
 * it attempts to derive it from the model name.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.valueKey] - The key corresponding to the model name.
 * @param {string} [params.tokenType] - The type of token (e.g., 'prompt' or 'completion').
 * @param {string} [params.model] - The model name to derive the value key from if not provided.
 * @param {string} [params.endpoint] - The endpoint name to derive the value key from if not provided.
 * @param {EndpointTokenConfig} [params.endpointTokenConfig] - The token configuration for the endpoint.
 * @returns {number} The multiplier for the given parameters, or a default value if not found.
 */
const getMultiplier = ({ valueKey, tokenType, model, endpoint, endpointTokenConfig }) => {
  if (endpointTokenConfig) {
    return endpointTokenConfig?.[model]?.[tokenType] ?? defaultRate;
  }

  if (valueKey && tokenType) {
    return tokenValues[valueKey][tokenType] ?? defaultRate;
  }

  if (!tokenType || !model) {
    return 1;
  }

  valueKey = getValueKey(model, endpoint);
  if (!valueKey) {
    return defaultRate;
  }

  // If we got this far, and values[tokenType] is undefined somehow, return a rough average of default multipliers
  return tokenValues[valueKey][tokenType] ?? defaultRate;
};

module.exports = { tokenValues, getValueKey, getMultiplier, defaultRate };
