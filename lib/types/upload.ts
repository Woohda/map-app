/**
 * @module lib/types/upload
 * @fileoverview Типы для загрузки файлов через UploadThing
 * @description
 * Этот модуль предоставляет типы для работы с загруженными файлами и вложениями.
 * Включает типы для загруженных изображений и вложений с состоянием загрузки.
 * ---
 * ### Типы данных:
 * - `UploadedImage`: Интерфейс загруженного изображения с URL и ключом
 * - `UploadAttachment`: Расширенный интерфейс с файлом и состоянием загрузки
 *
 * ### Поля UploadedImage:
 * - `url`: URL загруженного изображения
 * - `uploadthingKey`: Ключ файла в UploadThing
 *
 * ### Поля UploadAttachment:
 * - Расширяет UploadedImage
 * - `file`: Объект File для загрузки
 * - `imageId`: Уникальный идентификатор изображения
 * - `isUploading`: Состояние загрузки
 *
 * ### Примечания:
 * - `UploadAttachment` используется для отслеживания состояния загрузки
 * - `imageId` генерируется на клиенте для идентификации
 */

export interface UploadedImage {
  url: string;
  uploadthingKey: string;
}

export interface UploadAttachment extends UploadedImage {
  file: File;
  imageId: string;
  isUploading: boolean;
}
