# es6pacts

Releasable, Reporting Promises for Javascript ES6

## USAGE

This combines the releasable functionality of es6pledges with the
reporting functionality of es6tasks.


Pacts can be used just like Promises, with the addition of 
the ability to release the pact from it's obligation, via 
`resolve()`, `reject()` or `release()` and to get progress 
reports via `.progress()`

Releasing a pledge results in the execution of a release function 
that can terminate the work, and settle the underlying Promise.

Progress reports stop when the pact is released, resolved, or rejected.


## Example

```javascript

function pactDelay( time, frequency = 100 ){
	let timeout;
	return new Pact(
		// this is a delay function which reports progress every frequency milliseconds
		( resolve, reject, report ) => {
			let timeSlept = 0;
			let f = () => {
				let r = time > 0 ? timeSlept / time : 0;
				report( timeSlept );
				if ( timeSlept < ( time - frequency )){
					timeSlept += frequency;
					timeout = setTimeout( f, frequency );
				}
				else if (timeSlept < time ){
					timeout = setTimeout( f, time - timeSlept );
					timeSlept = time;
				}
				else{
					resolve( time );
				}
			}
			f();
		},
	
		// this is a release function 
		() => {
			clearTimeout(timeout);
		}
	);
}


const pact = pactDelay( 10000, 100 )
	.progress(( x ) => console.log( "progress: ", x ));
	.then(( x ) => console.log( "result: ", x ));
	
setTimeout(() => { pact.resolve("faster"); }, 500);

// output:
//
// progress: 0
// progress: 100
// progress: 200
// progress: 300
// progress: 400
// result: faster


## See Also
See 
* @debonet/es6pledges
* @debonet/es6tasks 




	
