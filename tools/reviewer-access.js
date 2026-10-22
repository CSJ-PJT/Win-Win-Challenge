'use strict';
// Explicit opt-in only. Uses the user's existing authenticated GitHub CLI session.
const {spawnSync}=require('node:child_process');
const args=process.argv.slice(2),username=args[0];
const repository='CSJ-PJT/Win-Win-Challenge';
function fail(message){console.error(message);process.exit(1);}
if(!username||!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username))fail('Usage: node tools/reviewer-access.js OFFICIAL_USERNAME [--invite --official-account-confirmed --ack-write-access]');
if(['official_username','username','csj-pjt'].includes(username.toLowerCase()))fail('Use the verified reviewer username, not a placeholder or owner.');
function api(endpoint,extra=[]){
 const result=spawnSync('gh',['api',endpoint,...extra],{encoding:'utf8',shell:false});
 if(result.error)fail('GitHub CLI is unavailable. Install gh and sign in as the repository administrator.');
 if(result.status!==0)fail('GitHub API operation failed. Check authentication, administrator access, and the exact reviewer username.');
 return result.stdout.trim()?JSON.parse(result.stdout):null;
}
const repo=api('repos/'+repository);
if(!repo.private)fail('Expected a private repository. No permissions have been changed.');
if(!repo.permissions?.admin)fail('Repository administrator permission is required.');
const user=api('users/'+username);
console.log(JSON.stringify({repository,reviewer:user.login,profile:user.html_url,ownerType:repo.owner.type,private:repo.private,mode:args.includes('--invite')?'invite':'read-only check'},null,2));
if(!args.includes('--invite')){
 console.log('No changes made. Confirm this exact account with the organizer before inviting.');
 process.exit(0);
}
if(!args.includes('--official-account-confirmed')||!args.includes('--ack-write-access'))fail('Invitation blocked: require both --official-account-confirmed and --ack-write-access. Personal-repository collaborators receive write access.');
const result=api('repos/'+repository+'/collaborators/'+encodeURIComponent(user.login),['--method','PUT','-f','permission=push']);
console.log(result?'Invitation sent; acceptance and reviewer-side file access still need confirmation.':'Existing collaborator access updated; confirm reviewer-side file access.');
