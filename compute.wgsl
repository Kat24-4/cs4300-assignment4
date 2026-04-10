@group(0) @binding(0) var<uniform> res: vec2f;
@group(0) @binding(1) var<storage> statein: array<f32>;
@group(0) @binding(2) var<storage, read_write> stateout: array<f32>;
@group(0) @binding(3) var<uniform> dA: f32;
@group(0) @binding(4) var<uniform> dB: f32;
@group(0) @binding(5) var<uniform> feed: f32;
@group(0) @binding(6) var<uniform> k: f32;

fn index( x:i32, y:i32 ) -> u32 {
  let _res = vec2i(res);
  return u32( (y % _res.y) * _res.x + ( x % _res.x ) );
}

fn lapA(x: i32, y: i32) -> f32 {
  var sumA: f32 = 0;
  sumA = sumA + statein[ index( x, y ) * 2 ] * -1;
  sumA = sumA + statein[ index( x - 1, y ) * 2 ] * 0.2;
  sumA = sumA + statein[ index( x + 1, y ) * 2 ] * 0.2;
  sumA = sumA + statein[ index( x, y + 1 ) * 2 ] * 0.2;
  sumA = sumA + statein[ index( x, y - 1 ) * 2 ] * 0.2;
  sumA = sumA + statein[ index( x - 1, y - 1 ) * 2 ] * 0.05; 
  sumA = sumA + statein[ index( x + 1, y - 1 ) * 2 ] * 0.05; 
  sumA = sumA + statein[ index( x - 1, y + 1 ) * 2 ] * 0.05; 
  sumA = sumA + statein[ index( x + 1, y + 1 ) * 2 ] * 0.05; 
  return sumA;
}

fn lapB(x: i32, y: i32) -> f32 {
  var sumB: f32 = 0;
  sumB = sumB + statein[ index( x, y ) * 2 + 1 ] * -1;
  sumB = sumB + statein[ index( x - 1, y ) * 2 + 1 ] * 0.2;
  sumB = sumB + statein[ index( x + 1, y ) * 2 + 1 ] * 0.2;
  sumB = sumB + statein[ index( x, y + 1 ) * 2 + 1 ] * 0.2;
  sumB = sumB + statein[ index( x, y - 1 ) * 2 + 1 ] * 0.2;
  sumB = sumB + statein[ index( x - 1, y - 1 ) * 2 + 1 ] * 0.05; 
  sumB = sumB + statein[ index( x + 1, y - 1 ) * 2 + 1 ] * 0.05; 
  sumB = sumB + statein[ index( x - 1, y + 1 ) * 2 + 1 ] * 0.05; 
  sumB = sumB + statein[ index( x + 1, y + 1 ) * 2 + 1 ] * 0.05; 
  return sumB;
}

@compute
@workgroup_size(8,8)
fn cs( @builtin(global_invocation_id) _cell:vec3u ) {
  let cell = vec3i(_cell);

  let i = index(cell.x, cell.y);

  let a = statein[i * 2];
  let b = statein[i * 2 + 1];

  stateout[i * 2] = clamp(a + (dA * lapA(cell.x, cell.y)) - (a * b * b) + (feed * (1 - a)), 0.0, 1.0);
  stateout[i * 2 + 1] = clamp(b + (dB * lapB(cell.x, cell.y)) + (a * b * b) - ((k + feed) * b), 0.0, 1.0);
}