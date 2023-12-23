import { Body, Controller, Inject, Post, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { VideoService } from "./video.service";
import { VideoRequest } from "./entity/video.request";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ResponseCodeConstants } from "../utils/constants";
import { TResponse } from "../utils/common/do/tresponse.dto";
import { Role, Roles } from "../utils/common/do";

@Controller("video")
export class VideoController {
  @Inject()
  private readonly videoService: VideoService;

  @Post("/findVideoByVideoId")
  async findVideoByVideoId(@Body() videoRequest: VideoRequest) {
    return this.videoService.findVideoByVideoId(videoRequest);
  }

  @Post("/deleteVideoByVideoId")
  @Roles([Role.LOGIN])
  async deleteVideoByVideoId(@Body() videoRequest: VideoRequest, @Req() req) {
    videoRequest.authorId = req.user.userId;
    return this.videoService.deleteVideoByVideoId(videoRequest);
  }

  @Post("/findVideoByAuthorId")
  @Roles([Role.LOGIN])
  async findVideoByAuthorId(@Body() videoRequest: VideoRequest, @Req() req) {
    videoRequest.authorId = req.user.userId;
    return this.videoService.findVideoByAuthorId(videoRequest);
  }

  @Post("/uploadVideo")
  @UseInterceptors(FilesInterceptor("files"))
  @Roles([Role.LOGIN])
  async uploadVideo(@UploadedFiles() files: Array<Express.Multer.File>, @Body() videoRequest: VideoRequest, @Req() req) {
    videoRequest.authorId = req.user.userId;
    return this.videoService.uploadVideo(videoRequest).then((result) => {
      return result > 0 ? TResponse.getSuccessResponse() : TResponse.getResponse(ResponseCodeConstants.UPLOAD_FAIL);
    });

  }
}
