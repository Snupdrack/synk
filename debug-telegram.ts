const token = "8954207807:AAFhBEQIOZ0I2p8fnwaz6gYvXL8H9ulyy3g";
const chatId = "8071178317";
const text = "Prueba de depuración directa desde el servidor";

async function test() {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML'
        })
      }
    );
    
    console.log('Status:', res.status);
    console.log('StatusText:', res.statusText);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
