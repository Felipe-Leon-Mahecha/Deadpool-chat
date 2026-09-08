import { describe, it, expect } from 'vitest';
import {
  isValidMessage,
  removeLoadingMessages,
  buildGeminiHistory,
  extractReplyText,
} from '../src/utils.js';

describe('isValidMessage', () => {
  it('devuelve true para un mensaje con texto', () => {
    expect(isValidMessage('hola')).toBe(true);
  });

  it('devuelve false para un string vacío', () => {
    expect(isValidMessage('')).toBe(false);
  });

  it('devuelve false para un string de solo espacios', () => {
    expect(isValidMessage('   ')).toBe(false);
  });
});

describe('removeLoadingMessages', () => {
  it('saca los mensajes marcados como loading', () => {
    const messages = [
      { role: 'user', text: 'hola' },
      { role: 'character', text: 'escribiendo...', loading: true },
    ];
    const result = removeLoadingMessages(messages);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('hola');
  });
});

describe('buildGeminiHistory', () => {
  it('convierte role "character" a "model" y descarta loading', () => {
    const messages = [
      { role: 'user', text: 'hola' },
      { role: 'character', text: 'qué tal', loading: true },
      { role: 'character', text: 'buena onda' },
    ];
    const result = buildGeminiHistory(messages);
    expect(result).toEqual([
      { role: 'user', text: 'hola' },
      { role: 'model', text: 'buena onda' },
    ]);
  });
});

describe('extractReplyText', () => {
  it('extrae el texto cuando la respuesta es válida', () => {
    expect(extractReplyText({ reply: '  hola  ' })).toBe('hola');
  });

  it('devuelve null si falta el campo reply', () => {
    expect(extractReplyText({})).toBeNull();
  });

  it('devuelve null si la respuesta completa es undefined', () => {
    expect(extractReplyText(undefined)).toBeNull();
  });
});