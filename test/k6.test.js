import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,
    iterations: 10,
};

export default function () {
    const baseUrl = 'http://localhost:3000/api';

    // 🔹 REGISTER
    const registerPayload = JSON.stringify({
        name: `User_${__VU}`,
        email: `user_${__VU}_${Date.now()}@test.com`,
        password: 'password123',
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const registerRes = http.post(
        `${baseUrl}/auth/register`,
        registerPayload,
        params
    );

    check(registerRes, {
        'register status ok': (r) => r.status === 201 || r.status === 200,
    });

    sleep(1);

    // 🔹 LOGIN
    const email = JSON.parse(registerRes.request.body).email;

    const loginPayload = JSON.stringify({
        email,
        password: 'password123',
    });

    const loginRes = http.post(
        `${baseUrl}/auth/login`,
        loginPayload,
        params
    );

    check(loginRes, {
        'login status ok': (r) => r.status === 200,
        'access token exists': (r) => r.json('data.token') !== undefined,
    });

    sleep(1);

    // CONCERTS
    const concertsRes = http.get(
        `${baseUrl}/concerts`,
        {
            headers: {
                Authorization: `Bearer ${loginRes.json('data.token')}`,
            },
        }
    );

    check(concertsRes, {
        'concerts status ok': (r) => r.status === 200,
        'concerts returned': (r) =>
            Array.isArray(r.json('data')) && r.json('data').length >= 0,
    });

    sleep(1);
}
