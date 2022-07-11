const Pact = require( "../src/es6pacts.js" );

if (!global.test){
	global.test = async function test(s,f){
		try{
			await f();
		}
		catch(err){
			console.error( "ERROR", err );
		}
		
	}
	let _x;
	expect = function( x ){ _x = x;return expect;}
	expect.toBe = function( x ){ if (x != _x){throw(["not equal", x, _x]);}}
}


function fpPactDelay( dtm, dtmReport = 100 ){
	let timeout;
	return new Pact(
		( fResolve, fReject, fReport ) => {
			let dtmSlept = 0;
			let f = () => {
				let r = dtm > 0 ? dtmSlept / dtm : 0;
				fReport( r );
				if ( dtmSlept < ( dtm - dtmReport )){
					dtmSlept += dtmReport;
					timeout = setTimeout( f, dtmReport );
				}
				else if (dtmSlept < dtm ){
					timeout = setTimeout( f, dtm - dtmSlept );
					dtmSlept = dtm;
				}
				else{
					fResolve( dtm );
				}
			}
			f();
		},
		() => {
			clearTimeout(timeout);
		}
	);
}


// --------------------------------------------
test( "simple resolve", async () => {

	let sProgress = "";
	
	const p1 = fpPactDelay( 10000 )
		.progress(( x ) => sProgress += x + ", " )

	setTimeout(() => { p1.resolve("faster"); }, 300);
	
	const s = await	p1;
	expect( s ).toBe( "faster" );


	expect( sProgress ).toBe( "0, 0.01, 0.02, " );
});

