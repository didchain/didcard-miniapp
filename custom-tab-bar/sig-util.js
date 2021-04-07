import { helper } from '@wecrpto/weaccount';

export const sigEid4Verify = ({ auth_url, random_token, did }, pk) => {
  const content = {
    auth_url: auth_url,
    random_token: random_token,
    did: did,
  };
  const text = JSON.stringify(content);
  const sig = helper.signMessage(text, pk);
  return {
    content,
    sig: sig,
  };
};
