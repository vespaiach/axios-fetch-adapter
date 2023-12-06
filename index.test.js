import {expect, test, describe, beforeEach, afterEach} from 'vitest'
import axios from "axios";
import fetchAdapter from "./index";
import {getLocal} from "mockttp";

describe('fetchAdapter', () => {
    const mockServer = getLocal();

    beforeEach(() => mockServer.start(18080));
    afterEach(() => mockServer.stop());

    test('basic', async () => {
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:18080',
            timeout: 1000,
            adapter: fetchAdapter,
        });
        await mockServer.forGet("/hello").thenReply(200, "A mocked response");
        const response = await axiosInstance.get("/hello");
        expect(response.data).to.equal("A mocked response");
    });
});
