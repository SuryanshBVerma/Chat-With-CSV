'use client'

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/external-link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Loader, Upload } from 'lucide-react';

export function EmptyScreen({setUrl} : {setUrl : (url : string) => void}) {

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [publicUrl, setPublicUrl] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch("/api/cloudinary", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.message || "Upload failed");
      }

      setPublicUrl(uploadData.result.secure_url);
      setUrl(uploadData.result.secure_url);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
      alert(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-10">

      {publicUrl ? (
        <div className="w-full lg:w-auto flex justify-center my-4">
          <p className="w-full px-4 py-3 text-xs bg-slate-200/2 text-black  rounded-xl border text-center">
            🪄 All done you can start you chat right ahead 🚀
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upload your CSV file</CardTitle>
            <CardDescription>
              You can upload a CSV file to chat with it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Your Chat...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Start Chatting
                  </>
                )}

              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}



